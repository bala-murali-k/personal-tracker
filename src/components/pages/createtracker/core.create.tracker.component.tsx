import {
    Activity,
    BookOpen,
    Coffee,
    Droplet,
    Dumbbell,
    Flame,
    Heart,
    Moon,
    Pill,
    Star,
    Target,
    Zap,
    type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Modal, Text, View } from "react-native";

// Component imports
import { TabId } from "@/components/layout/footertypes/footer.layot.type";
import FooterCreateSetupComponent from "@/components/pages/createtracker/setupcomponents/footer.create.setup.component";
import PreviewCreateSetupComponent from "@/components/pages/createtracker/setupcomponents/preview.create.setup.component";
import SteponeCreateSetupComponent from "@/components/pages/createtracker/setupcomponents/stepone.create.setup.component";
import StepthreeCreateSetupComponent from "@/components/pages/createtracker/setupcomponents/stepthree.create.setup.component";
import SteptwoCreateSetupComponent from "@/components/pages/createtracker/setupcomponents/steptwo.create.setup.component";
import TopbarCreateSetupComponent from "@/components/pages/createtracker/setupcomponents/topbar.create.setup.component";
import { createTracker, Tracker, type Goals } from "@/model/tracker.model";
import { useTrackerStorage } from "@/store/tracker.store";

// Interfaces
interface CoreProps {
    maxsteps: number;
    drawerModal: boolean;
    changeModalState: (state: boolean) => void;
    changeActive: (state: TabId) => void;
    closeModal: () => void;
}

export const PRESET_COLORS = [
    "#2563EB", // Blue
    "#10B981", // Emerald
    "#8B5CF6", // Purple
    "#F43F5E", // Rose
    "#F59E0B", // Amber
    "#06B6D4", // Cyan
    "#EC4899", // Pink
    "#14B8A6", // Teal
] as const;

export const PRESET_ICONS = [
    "Target",
    "Droplet",
    "Flame",
    "Heart",
    "Star",
    "Zap",
    "BookOpen",
    "Dumbbell",
    "Coffee",
    "Pill",
    "Moon",
    "Activity",
] as const;

export const PRESET_UNITS = [
    { label : "pages", kind: "Count", defaultStep: 1 },
    { label : "reps", kind: "Count", defaultStep: 1 },
    { label : "items", kind: "Count", defaultStep: 1 },
    { label : "Custom", kind: "Count", defaultStep: 1 },
] as const;

export const PRESET_GOALS: Goals = {
    enabled: false,
    daily: 0,
    weeklyActiveDays: [],
    weekly: 0
}

export type PresetColors = (typeof PRESET_COLORS)[number];
export type PresetIcons = (typeof PRESET_ICONS)[number];
export type PreSetUnits = (typeof PRESET_UNITS)[number];
export const MAX_TITLE_LENGTH = 25 as const;

export const PRESET_ICONS_MAP: Record<PresetIcons, LucideIcon> = {
    Target,
    Droplet,
    Flame,
    Heart,
    Star,
    Zap,
    BookOpen,
    Dumbbell,
    Coffee,
    Pill,
    Moon,
    Activity,
};

export function TrackerIcon({
    icon,
    size = 24,
    color = "#FFFFFF",
    fill = "#FFFFFF",
    strokeWidth = 2,
}: {
    icon?: string;
    size?: number;
    color?: string;
    fill?: string;
    strokeWidth?: number;
}) {
    const IconComponent = icon ? PRESET_ICONS_MAP[icon as PresetIcons] : null;
    if (IconComponent) {
        return (
            <IconComponent
                size={size}
                color={color}
                fill={fill}
                strokeWidth={strokeWidth}
            />
        );
    }
    return <Text style={{ fontSize: size * 0.85 }}>{icon ?? "🎯"}</Text>;
}

export default function CoreCreateTrackerComponent({ drawerModal, maxsteps, changeModalState, changeActive, closeModal }: CoreProps) {

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [trackerName, setTrackerName] = useState<string>("");
    const [trackerColor, setTrackerColor] = useState<PresetColors>("#2563EB");
    const [trackerIcon, setTrackerIcon] = useState<PresetIcons>("Target");
    const [trackerUnit, setTrackerUnit] = useState<PreSetUnits>(PRESET_UNITS[0]);
    const [customUnit, setCustomUnit] = useState<string>("");
    const [trackerGoals, setTrackerGoals] = useState<Goals>(PRESET_GOALS);
    const isCustom = trackerUnit.label === 'Custom';
    const unitLable = isCustom ? customUnit : trackerUnit.label;
    const addTracker = useTrackerStorage((tracker) => tracker.addTracker);

    function backWithClose() {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            return;
        }
        changeModalState(false);
        changeActive("home");
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={drawerModal}
            onRequestClose={() => { backWithClose() }}
        >
            <View className="h-full w-full bg-white">
                <TopbarCreateSetupComponent
                    currentStep={currentStep}
                    maxSteps={maxsteps}
                    backButton={() => { backWithClose() }}
                />
                <View className="flex-1">
                    <PreviewCreateSetupComponent
                        currentStep={currentStep}
                        name={trackerName}
                        icon={trackerIcon}
                        color={trackerColor}
                        unitLabel={unitLable}
                    />
                    {
                        currentStep === 1 ? 
                            <SteponeCreateSetupComponent
                                trackerName={trackerName}
                                color={trackerColor}
                                icon={trackerIcon}
                                changeTrackerName={(state: string) => {
                                    setTrackerName(state);
                                }}
                                changeColor={(state: PresetColors) => {
                                    setTrackerColor(state);
                                }}
                                changeIcon={(state: PresetIcons) => {
                                    setTrackerIcon(state);
                                }}
                            /> :
                            currentStep === 2 ?
                                <SteptwoCreateSetupComponent
                                    unit={trackerUnit}
                                    isCustomUnit={isCustom}
                                    customUnit={customUnit}
                                    changeUnit={(unit: PreSetUnits) => {
                                        setTrackerUnit(unit);
                                    }}
                                    changeCustomUnit={(unit: string) => {
                                        setCustomUnit(unit);
                                    }}
                                /> :
                                currentStep === 3 ?
                                    <StepthreeCreateSetupComponent
                                        goals={trackerGoals}
                                        unitLabel={unitLable}
                                        color={trackerColor}
                                        changeGoals={(goal: Goals) => {
                                            setTrackerGoals(goal);
                                        }}
                                    /> :
                            null
                    }
                </View>
                <FooterCreateSetupComponent
                    MAX_STEP={maxsteps}
                    currentStep={currentStep}
                    buttonText={currentStep === maxsteps ? "Finish" : "Continue"}
                    showSkip={currentStep === maxsteps}
                    skipText={currentStep === maxsteps ? "Skip this step and create" : "Skip this step"}
                    disabled={(currentStep === 1 && !Boolean(trackerName)) || (currentStep === 2 && isCustom && !Boolean(customUnit))}
                    changeCurrentStep={() => {
                        setCurrentStep(prev => prev + 1);
                    }}
                    finishSetup={() => {
                        let name = trackerName;
                        let unitLabel = trackerUnit?.label === "Custom" ? customUnit : trackerUnit?.label;
                        let step = trackerUnit?.defaultStep;
                        let icon = trackerIcon;
                        let color = trackerColor;
                        let goals = trackerGoals;
                        const createdTracker: Tracker = createTracker({
                            name: name,
                            unitLabel: unitLabel,
                            step: step,
                            icon: icon,
                            color: color,
                            goals: goals
                        });
                        addTracker(createdTracker)
                        closeModal();
                    }}
                />
            </View>
        </Modal>
    );
}
