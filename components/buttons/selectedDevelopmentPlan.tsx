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

export const SelectedDevelopmentPlan = () => {
    const [developmentPlans, setDevelopmentPlans] = useState<IDevelopmentPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<IDevelopmentPlan | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchDevelopmentPlan = async () => {
            try {
                const res = await DevelopmentPlanService.getDevelopmentPlans();
                const plans = res?.data?.data || [];
                setDevelopmentPlans(plans);
                if (plans.length > 0) {
                    setSelectedPlan(plans[0]);
                }
            } catch (error) {
                console.error({ error });
            }
        };
        fetchDevelopmentPlan();
    }, []);

    const handleSelect = (plan: IDevelopmentPlan) => {
        setSelectedPlan(plan);
        setModalVisible(false);
    };

    return (
        <View className="w-4/5 self-center mt-4">
            <Pressable
                className="border-2 border-white rounded-xl py-3 px-4 items-center active:opacity-50"
                onPress={() => setModalVisible(true)}
            >
                <Text className="text-white font-semibold text-center">
                    {`${selectedPlan?.name}, ${selectedPlan?.yearBegin} - ${selectedPlan?.yearBegin}` || "Seleccionar"}
                </Text>
            </Pressable>

            <Modal
                animationType="slide"
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
        </View>
    );
};
