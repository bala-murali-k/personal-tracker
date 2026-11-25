import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface TopbarCreateSetupProps {
    maxSteps: number;
    currentStep: number;
    backButton: () => void;
    onClose?: () => void;
    onPress?: () => void;
}

export default function TopbarCreateSetupComponent({ onClose, onPress, backButton, currentStep, maxSteps }: TopbarCreateSetupProps) {
    const handlePress = onClose || onPress;

    return (
        <View className="h-16 w-full px-4 flex-row items-center justify-between">
            <Pressable
                onPress={backButton}
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={8}
                className="active:opacity-70"
            >
                <View className="h-10 w-10 items-center justify-center bg-blue-500 rounded-full">
                    <ChevronLeft size={24} color={"#FFF"} />
                </View>
            </Pressable>

            <View className="flex-1 flex-row items-center gap-1.5 mx-4">
                {Array.from({ length: Math.max(0, maxSteps) }).map((_, index) => {
                    const isFilled = index < currentStep;
                    return (
                        <View
                            key={index}
                            className={cn(
                                "h-2 flex-1 rounded-full",
                                isFilled ? "bg-blue-500" : "bg-gray-200"
                            )}
                        />
                    );
                })}
            </View>

            <Text className="text-gray-700 font-medium">
                {`${currentStep} / ${maxSteps}`}
            </Text>
        </View>
    );
}