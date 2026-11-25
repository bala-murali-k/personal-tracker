// React Native imports
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// React Imports
import { useEffect, useState } from "react";

// Component Imports
import FooterLayoutComponent from "@/components/layout/footer.layout.component";
import { type TabId, type TabItem } from "@/components/layout/footertypes/footer.layot.type";
import CoreCreateTrackerComponent from "@/components/pages/createtracker/core.create.tracker.component";
import CoreHomeComponent from "@/components/pages/home/core.home.component";
import CoreInsightsComponent from "@/components/pages/insights/core.insights.component";
import CoreSettingsComponent from "@/components/pages/settings/core.settings.component";
import CoreTrackerComponent from "@/components/pages/trackers/core.tracker.component";
import { Activity, Footprints, Home, Plus, Settings } from "lucide-react-native";

// Constants
const FooterTabs: TabItem[] = [
    {
        id: "home",
        label: "Home",
        icon: Home,
    },
    {
        id: "tracker",
        label: "Trackers",
        icon: Footprints,
    },
    {
        id: "create",
        label: "Create",
        icon: Plus,
    },
    {
        id: "insights",
        label: "Insights",
        icon: Activity,
    },
    {
        id: "setting",
        label: "Settings",
        icon: Settings,
    },
];
const MAX_STEPS = 3;

export default function Index() {
	const insets = useSafeAreaInsets();

	const [active, setActive] = useState<TabId>("home");
    const [createDrawer, setCreateDrawer] = useState<boolean>(false);

    useEffect(() => {
        if (active === "create") {
            setCreateDrawer(true);
        }
    }, [active])

	return (
		<View className="bg-amber-50 flex-1 flex-col" style={{ paddingBottom: insets.bottom }}>
			<View className="w-full h-8"></View>
			<View className="flex-1">
                {
                    active === "home" ?
                    <CoreHomeComponent
                    /> :
                        active === "tracker" ?
                        <CoreTrackerComponent
                        /> :
                            active === "insights" ?
                            <CoreInsightsComponent
                            /> :
                            active === "setting" ?
                            <CoreSettingsComponent
                            /> :
                                active === "create" ?
                                    <View>
                                        <CoreCreateTrackerComponent
                                            maxsteps={MAX_STEPS}
                                            drawerModal={createDrawer}
                                            changeModalState={(state: boolean) => {
                                                setCreateDrawer(state);
                                            }}
                                            changeActive={(state: TabId) => {
                                                setActive(state);
                                            }}
                                            closeModal={() => {
                                                setActive("home");
                                                setCreateDrawer(false);
                                            }}
                                        />
                                    </View>:
                                    null
                }
            </View>
			<View className="w-full">
				<FooterLayoutComponent
					FooterTabs={FooterTabs}
					activeTab={active}
					setActive={(tabId: TabId) => {
						setActive(tabId)
					}}
                    createDrawer={createDrawer}
                    setCreateDrawer={(state: boolean) => {
                        setCreateDrawer(state)
                    }}
				/>
			</View>
		</View>
	);
}