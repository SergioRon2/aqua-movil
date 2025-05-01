import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal, Pressable, View, Text, ScrollView } from 'react-native';
import WheelColorPicker from 'react-native-wheel-color-picker';
import useStylesStore from 'store/styles/styles.store';

interface Props {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

const customSwatches = [
    '#DB2777', // Rosa principal
    '#FF6347', // Tomate
    '#00BFFF', // Azul
    '#7CFC00', // Verde
    '#FFD700', // Dorado
    '#8A2BE2', // Azul violeta
    '#000000', // Negro
];

export const ModalMulticolor = ({ visible, setVisible }: Props) => {
    const { setGlobalColor, globalColor } = useStylesStore();

    const onSelectColor = async (color: string) => {
        setGlobalColor(color);
        try {
            await AsyncStorage.setItem('@primary_color', color);
        } catch (error) {
            console.error('Error al guardar el color:', error);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => setVisible(false)}>
            <View className="w-full h-full bg-black/70 justify-center items-center">
                <View className="w-[90%] rounded-2xl py-4 px-4 gap-12 bg-white shadow-lg items-center">
                    <Text className="text-2xl font-bold mb-4" style={{ color: globalColor }}>
                        Selecciona un color
                    </Text>

                    <ScrollView horizontal contentContainerStyle={{ gap: 10, marginBottom: 20 }}>
                        {customSwatches.map((color) => (
                            <Pressable
                                key={color}
                                onPress={() => onSelectColor(color)}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: color,
                                }}
                            />
                        ))}
                    </ScrollView>

                    <View style={{ height: 250, width: '100%' }}>
                        <WheelColorPicker
                            color={globalColor}
                            onColorChange={(color) => setGlobalColor(color)} // Actualiza el color seleccionado
                            onColorChangeComplete={onSelectColor} // Guarda el color seleccionado
                            swatches={false} // Muestra los colores en formato de swatches
                        />
                    </View>

                    <Pressable
                        onPress={() => setVisible(false)}
                        className="w-[30%] p-3 mt-4 rounded-xl"
                        style={{ backgroundColor: globalColor }}>
                        <Text className="text-center text-white">Aceptar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};
