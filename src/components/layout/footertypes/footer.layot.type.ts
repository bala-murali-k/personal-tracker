// Imports
import { type LucideIcon } from "lucide-react-native";

export type TabId = "home" | "tracker" | "create" | "insights" | "setting";

export interface TabItem {
    id: TabId;
    label: string;
    icon: LucideIcon;
}