import { supabase } from "@/lib/supabase";

export const playgroundLoader = async ({ request, params }) => {
  const { data: screens } = await supabase.from("screens").select("*");

  const { imageId } = params;

  const activeScreen = screens.find((screen) => screen.id === imageId);

  const { data: markers } = await supabase
    .from("markers")
    .select("*")
    .eq("screenId", imageId);

  return { screens, markers, activeScreen, imageId };
};
