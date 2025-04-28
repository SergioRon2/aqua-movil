import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackButton } from 'components/buttons/backButton.component';

const ChatbotScreen = () => {
    const route = useRoute<any>();
    const { option } = route.params;
    const [input, setInput] = useState(option?.label || '');
    const [messages, setMessages] = useState<{ id: string; text: string; sender: 'user' | 'bot' }[]>([]);

    const handleSend = () => {
        if (input.trim() === '') return;

        const userMessage = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages((prev: any) => [...prev, userMessage]);

        const botResponse = { id: (Date.now() + 1).toString(), text: `You said: ${input}`, sender: 'bot' };
        setMessages((prev: any) => [...prev, botResponse]);

        setInput('');
    };

    const renderMessage = ({ item }: { item: { id: string; text: string; sender: 'user' | 'bot' } }) => (
        <View
            className={`my-1 p-3 rounded-xl max-w-[75%] ${item.sender === 'user' ? 'self-end bg-pink-600' : 'self-start bg-gray-300'
                }`}
        >
            <Text className={`${item.sender === 'user' ? 'text-white' : 'text-black'} text-base`}>{item.text}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-100">

            {/* Header */}
            <View className="p-4 bg-pink-600 items-center justify-start flex-row">
                {/* Back button */}
                <View className='absolute mx-2'>
                    <BackButton />
                </View>

                <View className='mx-auto justify-center items-center'>
                    <Text className="text-white text-2xl font-bold">Kira</Text>
                    <Text className="text-gray-300 text-sm font-bold">Chatbot</Text>
                </View>
            </View>

            {/* Chat messages */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 10 }}
                inverted
            />

            {/* Input area */}
            <View className="flex-row py-6 px-2 border-t border-gray-300 bg-white">
                <TextInput
                    className="flex-1 border border-gray-300 rounded-lg px-3 mr-2 text-base"
                    value={input}
                    onChangeText={setInput}
                    placeholder="Resuelve tus dudas con Kira, tu asistente virtual"
                />
                <TouchableOpacity
                    onPress={handleSend}
                    className="bg-pink-600 rounded-lg py-2 px-4 justify-center items-center"
                >
                    <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatbotScreen;
