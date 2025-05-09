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

export const SelectedDevelopmentPlan = () => {
    const [developmentPlans, setDevelopmentPlans] = useState<IDevelopmentPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<IDevelopmentPlan | null>(null);
    const { setPlanDesarrolloActivo } = useActiveStore()
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDevelopmentPlan = async () => {
            try {
                setIsLoading(true);
                const res = await DevelopmentPlanService.getDevelopmentPlans();
                const plans = res?.data?.data || [];
                setDevelopmentPlans(plans);
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
                setIsLoading(false);
            }
        };
        fetchDevelopmentPlan();
    }, []);

    const handleSelect = async (plan: IDevelopmentPlan) => {
        setSelectedPlan(plan);
        setPlanDesarrolloActivo(plan);
        await AsyncStorage.setItem('selectedPlan', JSON.stringify(plan));
        setModalVisible(false);
    };
    

    return (
        <View className="w-3/5 self-center">
            {isLoading ? (
                <View className="border border-white rounded-xl py-3 px-4 items-center">
                    <ActivityIndicator
                        className="self-center"
                        size={'small'}
                        color="#fff"
                    />
                </View>
            ) : (
                <>
                    <Pressable
                        className="border border-white rounded-xl py-3 px-4 items-center active:opacity-50"
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
        </View >
    );
};
