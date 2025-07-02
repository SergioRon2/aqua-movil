import AsyncStorage from "@react-native-async-storage/async-storage";
import { Loading } from "components/loading/loading.component";
import { useEffect, useState } from "react";
import { Pressable, View, Text, FlatList, Modal } from "react-native";
import useActiveStore from "store/actives/actives.store";
import useStylesStore from "store/styles/styles.store";

export const SelectedYears = () => {
    const { globalColor } = useStylesStore();
    const {
        planDesarrolloActivo,
        setFechaInicio,
        setFechaFin,
        selectedYearIndex,
        setSelectedYearIndex,
        isAllYears,
        setIsAllYears,
    } = useActiveStore();

    const [loading, setLoading] = useState<boolean>(false);
    const [isManualChange, setIsManualChange] = useState<boolean>(false);

    const startYear = planDesarrolloActivo?.yearBegin;
    const endYear = planDesarrolloActivo?.yearEnd;

    const years = startYear && endYear
        ? Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i)
        : [];

    useEffect(() => {
        const init = async () => {
            if (years.length === 0) return;

            try {
                const storedIndex = await AsyncStorage.getItem("selectedYearIndex");
                const storedIsAll = await AsyncStorage.getItem("isAllYears");

                if (storedIndex !== null && storedIsAll !== null) {
                    const index = parseInt(storedIndex, 10);
                    const all = storedIsAll === "true";

                    setSelectedYearIndex(index);
                    setIsAllYears(all);

                    if (all) {
                        const fechaInicio = `${startYear}-01-01`;
                        const fechaFin = `${endYear}-12-31`;
                        setFechaInicio(fechaInicio);
                        setFechaFin(fechaFin);
                    } else {
                        const year = years[index - 1];
                        const fechaInicio = `${year}-01-01`;
                        const fechaFin = `${year}-12-31`;
                        setFechaInicio(fechaInicio);
                        setFechaFin(fechaFin);
                    }
                } else {
                    const currentYear = new Date().getFullYear();
                    const closestYear = years.reduce((prev, curr) =>
                        Math.abs(curr - currentYear) < Math.abs(prev - currentYear) ? curr : prev
                    );

                    const index = years.findIndex(y => y === closestYear);
                    const fechaInicio = `${closestYear}-01-01`;
                    const fechaFin = `${closestYear}-12-31`;

                    setSelectedYearIndex(index + 1);
                    setIsAllYears(false);
                    setFechaInicio(fechaInicio);
                    setFechaFin(fechaFin);

                    await AsyncStorage.setItem("selectedYearIndex", (index + 1).toString());
                    await AsyncStorage.setItem("isAllYears", "false");
                    await AsyncStorage.setItem("fechaInicio", fechaInicio);
                    await AsyncStorage.setItem("fechaFin", fechaFin);
                }
            } catch (err) {
                console.error("Error cargando fechas:", err);
            }
        };

        init();
    }, [JSON.stringify(years)]);

    const handleYearSelect = async (index: number, year: number) => {
        setIsManualChange(true);
        setLoading(true);

        let fechaInicio = "";
        let fechaFin = "";

        if (selectedYearIndex === index + 1) {
            // Mostrar todos los años
            setSelectedYearIndex(0);
            setIsAllYears(true);

            fechaInicio = `${startYear}-01-01`;
            fechaFin = `${endYear}-12-31`;
        } else {
            // Año individual
            setSelectedYearIndex(index + 1);
            setIsAllYears(false);

            fechaInicio = `${year}-01-01`;
            fechaFin = `${year}-12-31`;
        }

        setFechaInicio(fechaInicio);
        setFechaFin(fechaFin);

        await AsyncStorage.setItem("selectedYearIndex", selectedYearIndex === index + 1 ? "0" : (index + 1).toString());
        await AsyncStorage.setItem("isAllYears", selectedYearIndex === index + 1 ? "true" : "false");
        await AsyncStorage.setItem("fechaInicio", fechaInicio);
        await AsyncStorage.setItem("fechaFin", fechaFin);

        await new Promise(resolve => setTimeout(resolve, 500));

        setTimeout(() => {
            setLoading(false);
            setIsManualChange(false);
        }, 4000);
    };

    return (
        <View className="py-4">
            {isManualChange && (
                <Modal transparent animationType="fade" visible={loading}>
                    <View className="bg-white flex-1 justify-center items-center">
                        <View className="h-1/4 justify-center items-center animate-fade-in">
                            <Loading />
                            <Text style={{ color: globalColor }} className="mt-4 text-lg font-semibold">
                                {isAllYears
                                    ? "Mostrando todos los años"
                                    : `Cambiando año a ${years[selectedYearIndex - 1]}`}
                            </Text>
                        </View>
                    </View>
                </Modal>
            )}

            <FlatList
                data={years}
                keyExtractor={(item) => item.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: '#ccc',
                    justifyContent: "center",
                    alignItems: "center",
                }}
                renderItem={({ item, index }) => (
                    <Pressable
                        onPress={() => handleYearSelect(index, item)}
                        style={selectedYearIndex === index + 1 && { borderColor: globalColor }}
                        className={`${selectedYearIndex === index + 1 ? 'border-b-2' : 'bg-transparent'} px-6 m-1 rounded-sm`}
                    >
                        <Text className="text-black text-xl font-bold text-center">{item}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
};
