import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function ScreenOptions(
  { onClickUpdate, onChange, activeScreen } = {
    onClickUpdate: () => {},
    onChange: (event) => {},
    activeScreen: { id: "", name: "", desc: "" },
  }
) {
  return (
    <div className="w-2/12 border-l-2">
      <CardHeader className="my-2 space-0 space-x-0 space-y-0 px-5 py-2">
        <CardTitle className="text-md border-b-2 py-2 m-0 space-0">
          Screen Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="screen-name" className="text-sm">
            Screen Name
          </Label>
          <Input
            value={activeScreen.name}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            id="screen-name"
            placeholder="Enter the screen name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="screen-description">Screen Description</Label>
          <Textarea
            value={activeScreen.desc}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            className="min-h-[100px]"
            id="screen-description"
            placeholder="Enter the screen description"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="permission-access">Permission to Access</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue
                id="permission-access"
                placeholder="Select permission level"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onClickUpdate} className="ml-auto">
          Save
        </Button>
      </CardFooter>
    </div>
  );
}
