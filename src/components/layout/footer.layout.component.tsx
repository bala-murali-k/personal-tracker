import { type TabId, type TabItem } from "@/components/layout/footertypes/footer.layot.type";
import { Pressable, Text, View, useColorScheme } from "react-native";

interface FooterLayoutProps {
    FooterTabs: TabItem[];
    activeTab: TabId;
    setActive: (tabId: TabId) => void;
    createDrawer: boolean;
    setCreateDrawer: (state: boolean) => void;
}

export default function FooterLayoutComponent({FooterTabs, activeTab, setActive, setCreateDrawer}: FooterLayoutProps) {
    
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const handleTabPress = (tabId: TabId) => {
        setActive(tabId);
    };

    return (
        <View className="bg-white h-16 flex-row items-center justify-evenly border-t border-gray-200 px-1">
            {
                FooterTabs?.map((mapData: TabItem) => {
                    const ItemIcon = mapData.icon;
                    const ItemText = mapData.label;
                    const ItemKey = mapData.id;
                    const IsActive = mapData.id === activeTab;

                    const create = () => {
                        setCreateDrawer(true)
                        console.log("Button is clicked")
                    }

                    const pressed = () => {
                        handleTabPress(ItemKey)
                    }

                    if (ItemKey === "create") {
                        return (
                            <Pressable
                                key={ItemKey}
                                onPress={() => {
                                    pressed();
                                    create();
                                }}
                                className="flex-1 items-center justify-center"
                            >
                                <View
                                    className="-translate-y-4 z-10 h-16 w-16 items-center justify-center rounded-full bg-blue-600"
                                    style={{ elevation: 8 }}
                                >
                                    <ItemIcon size={26} color="#FFFFFF" />
                                </View>
                            </Pressable>
                        )
                    }

                    return (
                        <Pressable key={ItemKey} onPress={pressed} className="flex-1 items-center justify-center gap-1">
                            <ItemIcon size={22} color={IsActive ? "#2563EB" : "#64748B"} />
                            <Text className={`text-xs ${IsActive ? "font-bold text-blue-600" : "text-gray-500"}`}>{ItemText}</Text>
                        </Pressable>
                    );
                })
            }
        </View>
    );

}
