import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'

export const SearchInput = () => {
    const [search, setSearch] = useState('')

    return (
        <View className={`flex-col animate-fade-in w-full mb-3 mx-3 gap-2 justify-between items-center space-x-2`}>
            <TextInput
                value={search}
                placeholder='Filtro de busqueda'
                placeholderTextColor={'#eee'}
                onChangeText={(e) => setSearch(e)}
                className="text-white w-3/4 h-14 px-6 border-2 border-white rounded-full"
            />
        </View>
    )
}
