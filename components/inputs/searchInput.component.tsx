import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export const SearchInput = () => {
    const [search, setSearch] = useState('')

    return (
        <View className="flex-row animate-fade-in border-2 border-white w-2/3 mx-3 gap-2 justify-between space-x-2 rounded-full">
            <TextInput
                value={search}
                onChangeText={(e) => setSearch(e)}
                className="text-white w-3/4 h-12 px-6"
            />
            <TouchableOpacity className="h-auto w-1/4 justify-center items-center rounded-full">
                <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    )
}
