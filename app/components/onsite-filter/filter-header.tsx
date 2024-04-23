import {View} from "react-native";
import {Text} from "app/components/text/text";
import React from "react";

export const FilterHeading = ({ title }: { title?: string }) => (
    <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            justifyContent: 'space-between',
            flex: 1,
        }}
    >
        <View
            style={{
                alignItems: 'flex-start',
                paddingBottom: 6,
                paddingTop: 6,
                paddingHorizontal: 4,
                marginVertical: 0,
            }}
        >
            <Text
                numberOfLines={1}
                style={{
                    fontSize: 22,
                    fontFamily: 'interstate',
                    textTransform: 'uppercase',
                }}
            >
                {title}
            </Text>
        </View>
    </View>
);