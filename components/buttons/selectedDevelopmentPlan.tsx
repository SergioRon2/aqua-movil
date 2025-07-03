import { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    Pressable,
    FlatList,
    TouchableOpacity
} from "react-native";
import { IDevelopmentPlan } from "interfaces/development-plan.interface";
import { DevelopmentPlanService } from "services/development-plan/development-plan.service";
import { CustomButtonPrimary } from "./mainButton.component";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useActiveStore from "store/actives/actives.store";
import useInternetStore from 'store/internet/internet.store';
import { Loading } from "components/loading/loading.component";
import useStylesStore from "store/styles/styles.store";
import { useCallback } from "react";

export const SelectedDevelopmentPlan = () => {
    const [developmentPlans, setDevelopmentPlans] = useState<IDevelopmentPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<IDevelopmentPlan | null>(null);
    const { setPlanDesarrolloActivo } = useActiveStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { online } = useInternetStore();
    const { globalColor } = useStylesStore();
    const [modalLoading, setModalLoading] = useState<boolean>(false);

    const fetchDevelopmentPlan = useCallback(async (showLoading = false) => {
        try {
            if (showLoading) setIsLoading(true);
            let plans: IDevelopmentPlan[] = [];
            if (online) {
                const res = await DevelopmentPlanService.getDevelopmentPlans();
                plans = res?.data?.data || [];
                setDevelopmentPlans(plans);
                await AsyncStorage.setItem('developmentPlans', JSON.stringify(plans));
            } else {
                const storedPlans = await AsyncStorage.getItem('developmentPlans');
                plans = storedPlans ? JSON.parse(storedPlans) : [];
                setDevelopmentPlans(plans);
            }
            if (plans.length > 0) {
                const storedPlan = await AsyncStorage.getItem('selectedPlan');
                if (storedPlan) {
                    const parsedPlan = JSON.parse(storedPlan);
                    const foundPlan = plans.find((plan: IDevelopmentPlan) => plan.id === parsedPlan.id);
                    if (foundPlan) {
                        setSelectedPlan(foundPlan);
                        setPlanDesarrolloActivo(foundPlan)
                    } else {
                        setSelectedPlan(plans[0]);
                        setPlanDesarrolloActivo(plans[0])
                    }
                } else {
                    setSelectedPlan(plans[0]);
                    setPlanDesarrolloActivo(plans[0])
                }
            }
        } catch (error) {
            console.error({ error });
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, [online, setPlanDesarrolloActivo]);

    useEffect(() => {
        fetchDevelopmentPlan(true);

        const interval = setInterval(() => {
            fetchDevelopmentPlan(false);
        }, 10000); 

        return () => clearInterval(interval); 
    }, [online]);

    const handleSelect = async (plan: IDevelopmentPlan) => {
        setModalLoading(true)
        setSelectedPlan(plan);
        setPlanDesarrolloActivo(plan);
        await AsyncStorage.setItem('selectedPlan', JSON.stringify(plan));
        setModalVisible(false);
        setTimeout(() => {
            setModalLoading(false)
        }, 2000)
    };


    return (
        <View className="w-3/5 self-center">
            {isLoading ? (
                <View className="border border-white rounded-full py-3 px-4 items-center">
                    <ActivityIndicator
                        className="self-center"
                        size={'small'}
                        color="#fff"
                    />
                </View>
            ) : (
                <>
                    <Pressable
                        className="border border-white rounded-full py-3 px-4 items-center active:opacity-50"
                        onPress={() => setModalVisible(true)}
                    >
                        <Text className="text-white font-semibold text-center">
                            {selectedPlan ? `${selectedPlan?.name}, ${selectedPlan?.yearBegin} - ${selectedPlan?.yearEnd}` : 'Selecciona un plan'}
                        </Text>
                    </Pressable >

                    <Modal
                        animationType="fade"
                        transparent
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View className="flex-1 justify-center items-center bg-black/40 px-5">
                            <View className="bg-white rounded-2xl p-5 w-full max-h-[70%]">
                                <Text className="text-2xl font-bold mb-4 text-gray-800">Selecciona un plan</Text>

                                <FlatList
                                    data={developmentPlans}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            className="py-4 border-b border-gray-200"
                                            onPress={() => handleSelect(item)}
                                        >
                                            <Text className="text-base text-gray-700">{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />

                                <View className="py-2 items-center justify-center">
                                    <CustomButtonPrimary rounded title="Cerrar" onPress={() => setModalVisible(false)} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </>
            )}


            {modalLoading && (
                <Modal
                    transparent
                    animationType="fade"
                    visible={modalLoading}
                    onRequestClose={() => { }}
                >
                    <View className="bg-white flex-1 justify-center items-center">
                        <View className="h-1/4 justify-center items-center animate-fade-in">
                            <Loading />
                            <Text style={{ color: globalColor }} className="mt-4 text-lg font-bold">Cambiando el plan de desarrollo a {selectedPlan?.name}</Text>
                        </View>
                    </View>
                </Modal>
            )}
        </View >
    );
};
