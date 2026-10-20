// Overlay locally owned Flow primitives on the pinned external Binder adapter.
import * as Button from "@/components/ui/button";
import * as Badge from "@/components/ui/badge";
import * as Status from "@/components/ui/status-indicator";
import * as Card from "@/components/ui/card";
import * as Stat from "@/components/ui/stat";
import * as Empty from "@/components/ui/empty-state";
import * as Skeleton from "@/components/ui/skeleton";
import * as Input from "@/components/ui/input";
import * as Textarea from "@/components/ui/textarea";
import * as Label from "@/components/ui/label";
import * as Checkbox from "@/components/ui/checkbox";
import * as Switch from "@/components/ui/switch";
import * as Tabs from "@/components/ui/tabs";
import * as Table from "@/components/ui/table";
import * as Stepper from "@/components/ui/stepper";
import * as Avatar from "@/components/ui/avatar";
import * as Kbd from "@/components/ui/kbd";
import * as Patch from "@/components/ui/feature-patch";
import * as Header from "@/components/ui/section-header";
// Webpack legacy exports are getter-only. Copy their values into a fresh namespace.
window.Rvlt = Object.assign({},window.Rvlt,Button,Badge,Status,Card,Stat,Empty,Skeleton,Input,Textarea,Label,Checkbox,Switch,Tabs,Table,Stepper,Avatar,Kbd,Patch,Header);
