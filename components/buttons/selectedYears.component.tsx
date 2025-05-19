import { useEffect, useState } from "react";
import { Pressable, View, Text, FlatList } from "react-native";
import useActiveStore from "store/actives/actives.store";
import useStylesStore from "store/styles/styles.store";

export const SelectedYears = () => {
    const { globalColor } = useStylesStore();
    const { planDesarrolloActivo } = useActiveStore();
    const [selected, setSelected] = useState<number>(1);
    const { setFechaInicio, setFechaFin } = useActiveStore();

    const startYear = planDesarrolloActivo?.yearBegin;
    const endYear = planDesarrolloActivo?.yearEnd;

    const years = startYear && endYear
        ? Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i)
        : [];

    useEffect(() => {
        if (years.length > 0) {
            const currentYear = new Date().getFullYear();
            let closestYear = years.reduce((prev, curr) =>
                Math.abs(curr - currentYear) < Math.abs(prev - currentYear) ? curr : prev
            );

            const index = years.findIndex(y => y === closestYear);
            setSelected(index + 1); // +1 para mantener tu lógica original

            const fechaInicio = `${closestYear}-01-01`;
            const fechaFin = `${closestYear}-12-31`;

            setFechaInicio(fechaInicio);
            setFechaFin(fechaFin);
        }
    }, [JSON.stringify(years)]);


    return (
        <View className="py-4">
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
                        onPress={() => {
                            if (selected === index + 1) {
                                // Tocar el mismo año -> seleccionar TODO el rango
                                setSelected(0); // 0 = modo "rango completo"
                                const fechaInicio = `${startYear}-01-01`;
                                const fechaFin = `${endYear}-12-31`;
                                setFechaInicio(fechaInicio);
                                setFechaFin(fechaFin);
                            } else {
                                // Tocar un año diferente -> seleccionar solo ese año
                                setSelected(index + 1);
                                const year = item;
                                const fechaInicio = `${year}-01-01`;
                                const fechaFin = `${year}-12-31`;
                                setFechaInicio(fechaInicio);
                                setFechaFin(fechaFin);
                            }
                        }}
                        style={selected === index + 1 && { borderColor: globalColor }}
                        className={`${selected === index + 1 ? 'border-b-2' : 'bg-transparent'} px-6 m-1 rounded-sm`}
                    >
                        <Text className="text-black text-xl font-bold text-center">{item}</Text>
                    </Pressable>

                )}
            />
        </View>
    );
};
