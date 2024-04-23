import React from "react";
import {View} from "react-native";
import {pickColor, pickColorSingleShade} from "app/theme/native-base/pick-color";
import {FontAwesomeIcon} from "app/components";
import {Text} from "app/components/text/text";
import { LocalizationContext } from 'app/contexts';
interface SwipeActionProps {
    align: 'left' | 'right';
}

export const SwipeAction: React.FC<SwipeActionProps> = ({ align }) => {
    const { t } = React.useContext(LocalizationContext);
    return (
        <View
            style={{
                flex: 1,
                alignItems: align === 'left' ? 'flex-start' : 'flex-end',
                paddingRight: 16,
                backgroundColor: pickColor({
                    name: align === 'left' ? 'bp-accent' : 'bp-cancel',
                    shade: 500,
                }),
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 8,
                    paddingTop: 16,
                }}
            >
                <View>
                    <FontAwesomeIcon
                        icon={align === 'left' ? ['fas', 'user-hard-hat'] : ['fas', 'sign-out']}
                        colors={align === 'left' ? ['bp-support', 'bp-support'] : ['bp-white', 'bp-white']}
                        size={24}
                    />
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            color:
                                align === 'left'
                                    ? pickColor({ name: 'bp-support', shade: 500 })
                                    : pickColorSingleShade({ name: 'bp-white' }),
                        }}
                    >
                        {align === 'left' ? t('workerInfoLabel') : t('workerCheckOutAlertTitle')}
                    </Text>
                </View>
            </View>
        </View>
    );
}