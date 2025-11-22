import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { paragraphVariants } from "@/components/ui/typography";
import {
  DRAINAGE_TYPES,
  LAND_USE_TYPES,
  PAVEMENT_TYPES,
  SHOULDER_TYPES,
  SHOULDER_WIDTHS,
  TERRAIN_TYPES,
} from "@repo/shared";
import { Mountain, Ruler, Settings, TreePine, Waves } from "lucide-react";
import { useFormContext } from "react-hook-form";
import PavementDamageForms from "./pavement-damage-forms";

export default function SegmentForms() {
  const form = useFormContext();
  return (
    <div className="max-w-4xl space-y-2">
      <h3
        className={paragraphVariants({
          size: "lg",
          className: "font-medium",
        })}
      >
        Segment Attributes
      </h3>
      <Separator />

      <Tabs defaultValue="left-side" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="left-side">Left Side</TabsTrigger>
          <TabsTrigger value="pavement">Pavement</TabsTrigger>
          <TabsTrigger value="right-side">Right Side</TabsTrigger>
        </TabsList>

        <TabsContent value="left-side" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Left Shoulder Type */}
            <FormField
              control={form.control}
              name="leftShoulderType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shoulder Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select shoulder type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHOULDER_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <Settings className="size-3.5" />
                              <span className="capitalize">
                                {type === "none"
                                  ? "No Shoulder"
                                  : `${type} Shoulder`}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Left Shoulder Width */}
            <FormField
              control={form.control}
              name="leftShoulderWidthM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shoulder Width</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select shoulder width" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHOULDER_WIDTHS.map((width) => (
                          <SelectItem key={width} value={width}>
                            <div className="flex items-center gap-2">
                              <Ruler className="size-3.5" />
                              <span>{width}m</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Left Drainage Type */}
            <FormField
              control={form.control}
              name="leftDrainageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drainage Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select drainage type" />
                      </SelectTrigger>
                      <SelectContent>
                        {DRAINAGE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <Waves className="size-3.5" />
                              <span className="capitalize">
                                {type === "none"
                                  ? "No Drainage"
                                  : type === "not_required"
                                    ? "Not Required"
                                    : type === "masonry_open"
                                      ? "Masonry Open"
                                      : type === "masonry_covered"
                                        ? "Masonry Covered"
                                        : type}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Left Land Use Type */}
            <FormField
              control={form.control}
              name="leftLandUseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land Use Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select land use type" />
                      </SelectTrigger>
                      <SelectContent>
                        {LAND_USE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <TreePine className="size-3.5" />
                              <span className="capitalize">
                                {type === "none"
                                  ? "No Land Use"
                                  : `${type} Land`}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="right-side" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Right Shoulder Type */}
            <FormField
              control={form.control}
              name="rightShoulderType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shoulder Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select shoulder type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHOULDER_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <Settings className="size-3.5" />
                              <span className="capitalize">
                                {type === "none"
                                  ? "No Shoulder"
                                  : `${type} Shoulder`}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Right Shoulder Width */}
            <FormField
              control={form.control}
              name="rightShoulderWidthM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shoulder Width</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select shoulder width" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHOULDER_WIDTHS.map((width) => (
                          <SelectItem key={width} value={width}>
                            <div className="flex items-center gap-2">
                              <Ruler className="size-3.5" />
                              <span>{width}m</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Right Drainage Type */}
            <FormField
              control={form.control}
              name="rightDrainageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drainage Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select drainage type" />
                      </SelectTrigger>
                      <SelectContent>
                        {DRAINAGE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <Waves className="size-3.5" />
                              <span className="capitalize">
                                {type === "none"
                                  ? "No Drainage"
                                  : type === "not_required"
                                    ? "Not Required"
                                    : type === "masonry_open"
                                      ? "Masonry Open"
                                      : type === "masonry_covered"
                                        ? "Masonry Covered"
                                        : type}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Right Land Use Type */}
            <FormField
              control={form.control}
              name="rightLandUseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land Use Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select land use type" />
                      </SelectTrigger>
                      <SelectContent>
                        {LAND_USE_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <TreePine className="size-3.5" />
                              <span className="capitalize">
                                {type === "none"
                                  ? "No Land Use"
                                  : `${type} Land`}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="pavement" className="mt-4">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Pavement Type */}
            <FormField
              control={form.control}
              name="pavementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pavement Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={
                        form.formState.isSubmitting ||
                        form.getValues("notPassable") === true
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select pavement type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAVEMENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <Settings className="size-3.5" />
                              <span className="capitalize">
                                {type === "unpaved"
                                  ? "Unpaved Road"
                                  : `${type} Pavement`}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Pavement Width */}
            <FormField
              control={form.control}
              name="pavementWidthM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pavement Width</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Ruler className="size-3.5" />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        type="number"
                        placeholder="Enter pavement width"
                        disabled={form.getValues("notPassable") === true}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                      <InputGroupAddon align="inline-end">
                        <span className="text-muted-foreground text-sm">m</span>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Carriageway Width */}
            <FormField
              control={form.control}
              name="carriagewayWidthM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carriageway Width</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Ruler className="size-3.5" />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        type="number"
                        disabled={form.getValues("notPassable") === true}
                        placeholder="Enter carriageway width"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                      <InputGroupAddon align="inline-end">
                        <span className="text-muted-foreground text-sm">m</span>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Right of Way Width */}
            <FormField
              control={form.control}
              name="rightOfWayWidthM"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Right of Way Width</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Ruler className="size-3.5" />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        type="number"
                        disabled={form.getValues("notPassable") === true}
                        placeholder="Enter right of way width"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                      <InputGroupAddon align="inline-end">
                        <span className="text-muted-foreground text-sm">m</span>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Terrain */}
            <FormField
              control={form.control}
              name="terrain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terrain</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={
                        form.formState.isSubmitting ||
                        form.getValues("notPassable") === true
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select terrain type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TERRAIN_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              <Mountain className="size-3.5" />
                              <span className="capitalize">{type}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Not Passable Checkbox */}
            <FormField
              control={form.control}
              name="notPassable"
              render={({ field }) => (
                <FormItem className="flex h-full flex-1 flex-row items-end pb-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Not Passable</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <PavementDamageForms />
        </TabsContent>
      </Tabs>
    </div>
  );
}
