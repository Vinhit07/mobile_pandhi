import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Typography from '../constants/Typography';
import { useTheme } from '../context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 80;

interface PopupCardProps {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    isLive?: boolean;
    onViewMenu?: () => void;
}

const PopupCard: React.FC<PopupCardProps> = ({
    id,
    title,
    subtitle,
    image,
    isLive = false,
    onViewMenu,
}) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const styles = createStyles(theme);

    const handleViewMenu = () => {
        if (onViewMenu) {
            onViewMenu();
        } else {
            navigation.navigate('PopupDetail' as never, { popupId: id } as never);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: image }}
                style={styles.imageBackground}
                imageStyle={styles.image}
            >
                <View style={styles.overlay}>
                    {isLive && (
                        <View style={styles.liveBadge}>
                            <View style={styles.liveIndicator} />
                            <Text style={styles.liveText}>LIVE NOW</Text>
                        </View>
                    )}
                    <View style={styles.content}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                    </View>
                    <TouchableOpacity style={styles.viewMenuButton} onPress={handleViewMenu}>
                        <Text style={styles.viewMenuText}>View Menu</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: 160,
        marginRight: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    image: {
        borderRadius: 16,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 16,
        justifyContent: 'space-between',
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#22C55E',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
        gap: 6,
    },
    liveIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
    },
    liveText: {
        fontSize: Typography.sizes.xs,
        fontWeight: Typography.weights.bold,
        color: '#FFFFFF',
    },
    content: {
        marginTop: 'auto',
        marginBottom: 8,
    },
    title: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: Typography.sizes.sm,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    viewMenuButton: {
        backgroundColor: theme.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    viewMenuText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.semibold,
        color: '#FFFFFF',
    },
});

export default PopupCard;
