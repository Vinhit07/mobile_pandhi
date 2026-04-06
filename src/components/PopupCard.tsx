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
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 300;

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
            (navigation as any).navigate('PopupDetail', { popupId: id });
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handleViewMenu}
            activeOpacity={0.95}
        >
            <ImageBackground
                source={{ uri: image }}
                style={styles.imageBackground}
                imageStyle={styles.image}
            >
                <LinearGradient
                    colors={['transparent', 'rgba(53, 28, 21, 0.4)', 'rgba(53, 28, 21, 0.9)']}
                    locations={[0, 0.5, 1]}
                    style={styles.gradient}
                >
                    {isLive && (
                        <View style={styles.liveBadge}>
                            <Text style={styles.liveText}>Live Now</Text>
                        </View>
                    )}
                    <View style={styles.bottomContent}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.subtitle}>{subtitle}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.viewMenuButton}
                            onPress={handleViewMenu}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.viewMenuText}>View Menu</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: 180,
        marginRight: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.border,
    },
    imageBackground: {
        flex: 1,
    },
    image: {
        borderRadius: 16,
        opacity: 0.9,
    },
    gradient: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    liveBadge: {
        alignSelf: 'flex-start',
        backgroundColor: theme.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    liveText: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.brownDark,
        fontFamily: 'PlusJakartaSans_700Bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    bottomContent: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans_700Bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        fontFamily: 'PlusJakartaSans_500Medium',
    },
    viewMenuButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    viewMenuText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
});

export default PopupCard;
