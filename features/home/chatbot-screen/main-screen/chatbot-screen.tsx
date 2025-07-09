import { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { BackButton } from 'components/buttons/backButton.component';
import useStylesStore from 'store/styles/styles.store';
import { KiraAssistantService } from 'services/ia/kiraAssistant.service';
import useInternetStore from 'store/internet/internet.store';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const STORAGE_KEY = '@kira_chat_messages';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ChatbotScreen = () => {
    const translateX = useSharedValue(-100);
    const { globalColor } = useStylesStore();
    const { online } = useInternetStore();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ id: string; text: string; sender: 'user' | 'bot' }[]>([]);
    const [loading, setLoading] = useState(false);
    const [dots, setDots] = useState('');

    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.5, { duration: 700 }),
            -1,
            true
        );
    }, []);

    useEffect(() => {
        translateX.value = withRepeat(
            withTiming(SCREEN_WIDTH, { duration: 2000 }),
            -1,
            false
        );
    }, []);

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length < 3 ? prev + '.' : ''));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Load saved messages on mount
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const storedMessages = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedMessages) setMessages(JSON.parse(storedMessages));
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };
        loadMessages();
    }, []);

    // Save messages to storage every time they change
    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages)).catch((error) =>
            console.error('Error saving messages:', error)
        );
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages((prev: any) => [...prev, userMessage]);
        setInput('');

        try {
            setLoading(true);
            const res = await KiraAssistantService.questionPostKira(input);
            const botText = res?.data?.answer?.replace(/<\/?[^>]+(>|$)/g, "") || 'No response received.';
            const botMessage = { id: Date.now().toString(), text: botText, sender: 'bot' };
            setMessages((prev: any) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error fetching response:', error);
            setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Error fetching response', sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = ({ item }: { item: { id: string; text: string; sender: 'user' | 'bot' } }) => (
        <View
            style={{ backgroundColor: item.sender === 'user' ? globalColor : '#f0f0f0' }}
            className={`my-1 p-3 shadow-lg rounded-xl max-w-[75%] ${item.sender === 'user' ? 'self-end' : 'self-start border border-gray-300'}`}
        >
            <Text className={`${item.sender === 'user' ? 'text-white' : 'text-black'} text-base`}>{item.text}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-100">

            {/* Header */}
            <View style={{ backgroundColor: globalColor }} className="p-4 items-center justify-start flex-row">
                <View className='absolute mx-2'>
                    <BackButton />
                </View>
                <View className='mx-auto justify-center items-center'>
                    <Text className="text-white text-2xl font-bold">Kira</Text>
                    <Text className="text-gray-300 text-sm font-bold">Chatbot</Text>
                </View>
            </View>

            {/* Messages */}
            <FlatList
                data={[...messages].reverse()}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 10 }}
                inverted
            />

            {/* Typing indicator */}
            {loading && (
                <Animated.View
                    className="flex-row items-center justify-center mb-2"
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={{ overflow: 'hidden', borderRadius: 999 }}
                >
                    <View className="bg-gray-300 rounded-full px-4 py-2 relative overflow-hidden">
                        <Text className="text-gray-600 text-base text">Kira está escribiendo{dots}</Text>

                        {/* Shimmer Layer */}
                        <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
                            <LinearGradient
                                colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={StyleSheet.absoluteFill}
                            />
                        </Animated.View>
                    </View>
                </Animated.View>
            )}

            {/* Input */}
            {online && (
                <View className="flex-row py-6 px-6 border-t border-gray-300 bg-white">
                    <TextInput
                        className="flex-1 border border-gray-300 rounded-lg px-3 mr-2 text-base"
                        value={input}
                        onChangeText={setInput}
                        placeholder="Resuelve tus dudas con Kira"
                    />
                    <TouchableOpacity
                        disabled={loading}
                        style={{ backgroundColor: !loading ? globalColor : `${globalColor}88` }}
                        onPress={handleSend}
                        className="rounded-lg py-2 px-4 justify-center items-center"
                    >
                        {loading
                            ? <ActivityIndicator size={'small'} color={'white'} />
                            : <Ionicons name="send" size={20} color="white" />
                        }
                    </TouchableOpacity>
                </View>
            )}

            {!online && (
                <View className="flex-row py-6 px-6 border-t border-gray-300 bg-white">
                    <Text className="text-gray-500 text-base text-center">No tienes conexión a Internet</Text>
                </View>
            )}
        </View>
    );
};

export default ChatbotScreen;
