/**
 * Canvas Code Components registry.
 *
 * Import this file to register all Code Components with the
 * canvas-registry before rendering.
 */

import { registerComponent } from "@/lib/canvas-registry";

// UI Primitives
import Accordion from "./accordion";
import AccordionItem from "./accordion_item";
import Alert from "./alert";
import Avatar from "./avatar";
import Badge from "./badge";
import Breadcrumb from "./breadcrumb";
import Button from "./button";
import ButtonGroup from "./button_group";
import Card from "./card";
import Carousel from "./carousel";
import Collapsible from "./collapsible";
import DarkModeSwitch from "./dark_mode_switch";
import Dialog from "./dialog";
import Progress from "./progress";
import HoverCard from "./hover_card";
import Pagination from "./pagination";
import ScrollArea from "./scroll_area";
import Separator from "./separator";
import Skeleton from "./skeleton";
import TabItem from "./tab_item";
import Tabs from "./tabs";
import Heading from "./heading";
import Text from "./text";
import ToggleGroup from "./toggle_group";
import Tooltip from "./tooltip";
import CanvasInput from "./input";
import CanvasTextarea from "./textarea";
import CanvasSelect from "./canvas_select";
import CanvasCheckbox from "./checkbox";
import CanvasRadioGroup from "./radio_group";
import CanvasSwitch from "./canvas_switch";
import CanvasLabel from "./canvas_label";
import CanvasField from "./field";

// Page Builders
import Hero from "./hero";
import Section from "./section";
import CtaBanner from "./cta_banner";
import Testimonial from "./testimonial";
import Footer from "./footer";
import Header from "./header";
import Menu from "./menu";
import Branding from "./branding";
import PageTitle from "./page_title";
import CanvasImage from "./image";

// Register all components with their Canvas component_id (js.<machineName>)
registerComponent("js.accordion", Accordion);
registerComponent("js.accordion_item", AccordionItem);
registerComponent("js.alert", Alert);
registerComponent("js.avatar", Avatar);
registerComponent("js.badge", Badge);
registerComponent("js.breadcrumb", Breadcrumb);
registerComponent("js.button", Button);
registerComponent("js.button_group", ButtonGroup);
registerComponent("js.card", Card);
registerComponent("js.carousel", Carousel);
registerComponent("js.collapsible", Collapsible);
registerComponent("js.dark_mode_switch", DarkModeSwitch);
registerComponent("js.dialog", Dialog);
registerComponent("js.progress", Progress);
registerComponent("js.hover_card", HoverCard);
registerComponent("js.pagination", Pagination);
registerComponent("js.scroll_area", ScrollArea);
registerComponent("js.separator", Separator);
registerComponent("js.skeleton", Skeleton);
registerComponent("js.tab_item", TabItem);
registerComponent("js.tabs", Tabs);
registerComponent("js.heading", Heading);
registerComponent("js.text", Text);
registerComponent("js.toggle_group", ToggleGroup);
registerComponent("js.tooltip", Tooltip);
registerComponent("js.input", CanvasInput);
registerComponent("js.textarea", CanvasTextarea);
registerComponent("js.canvas_select", CanvasSelect);
registerComponent("js.checkbox", CanvasCheckbox);
registerComponent("js.radio_group", CanvasRadioGroup);
registerComponent("js.canvas_switch", CanvasSwitch);
registerComponent("js.canvas_label", CanvasLabel);
registerComponent("js.field", CanvasField);
registerComponent("js.hero", Hero);
registerComponent("js.section", Section);
registerComponent("js.cta_banner", CtaBanner);
registerComponent("js.testimonial", Testimonial);
registerComponent("js.footer", Footer);
registerComponent("js.header", Header);
registerComponent("js.menu", Menu);
registerComponent("js.branding", Branding);
registerComponent("js.page_title", PageTitle);
registerComponent("js.image", CanvasImage);
