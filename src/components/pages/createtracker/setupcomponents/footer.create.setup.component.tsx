// Required imports
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FooterCreateSetupProps {
    changeCurrentStep: () => void;
    onPress?: () => void;
    onSkip?: () => void;
    finishSetup: () => void;
    MAX_STEP: number;
    currentStep: number;
    showSkip?: boolean;
    skipText?: string;
    disabled?: boolean;
    isDisabled?: boolean;
    buttonText?: string;
}

export default function FooterCreateSetupComponent({
    changeCurrentStep,
    onPress,
    onSkip,
    finishSetup,
    MAX_STEP,
    currentStep,
    showSkip = false,
    skipText = "Skip this step",
    disabled = false,
    isDisabled = false,
    buttonText = "Continue",
}: FooterCreateSetupProps) {
    const insets = useSafeAreaInsets();
    const handlePress = changeCurrentStep || onPress;
    const handleSkip = onSkip || handlePress;
    const isButtonDisabled = disabled || isDisabled;

    return (
        <View
            className="w-full px-6 pt-2 bg-white border-t border-gray-100"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
            {showSkip && (
                <Pressable
                    onPress={handleSkip}
                    accessibilityRole="button"
                    accessibilityLabel={skipText}
                    hitSlop={8}
                    className="items-center justify-center py-1.5 mb-2 active:opacity-60"
                >
                    <Text className="text-sm font-semibold text-gray-400">
                        {skipText}
                    </Text>
                </Pressable>
            )}

            <Pressable
                onPress={() => {
                    // if ((currentStep + 1) > MAX_STEP) return;
                    if (currentStep === MAX_STEP) {
                        console.log('HHHHHHHHHHHHH')
                        finishSetup();
                        return;
                    } else if ((currentStep + 1) > MAX_STEP) {
                        return;
                    }
                    changeCurrentStep();
                }}
                disabled={isButtonDisabled}
                accessibilityRole="button"
                accessibilityState={{ disabled: isButtonDisabled }}
                accessibilityLabel={buttonText}
                className={cn(
                    "w-full h-14 rounded-full items-center justify-center shadow-sm",
                    isButtonDisabled
                        ? "bg-gray-200 opacity-80"
                        : "bg-blue-500 active:bg-blue-600"
                )}
            >
                <Text
                    className={cn(
                        "font-semibold text-base",
                        isButtonDisabled ? "text-gray-400" : "text-white"
                    )}
                >
                    {buttonText}
                </Text>
            </Pressable>
        </View>
    );
}