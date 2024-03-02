// QnPYHY3XVI6bAkMl sbase pass db
import styled from "styled-components";
import * as markerjs2 from "../../markerjs/src";
import { v4 as uuid } from "uuid";

import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
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
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ScreenOptions } from "@/components/ScreenOptions/ScreenOptions";
import { useLoaderData, useNavigate, useNavigation } from "react-router-dom";

const Wrapper = styled.div``;

const FullPageLoading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
`;

function getRandomHexColor() {
  const randomColorNumber = Math.floor(Math.random() * 16777215);
  const hexColor = randomColorNumber.toString(16).padStart(6, "0");

  return `#${hexColor}`;
}

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 24,
  className,
  ...props
}: ISVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={"animate-spin"}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

function cropImage(imageUrl, x, y, h, w, currentWidth, currentHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Enable CORS for the image
    img.onload = function () {
      const scaleX = img.width / currentWidth;
      const scaleY = img.height / currentHeight;

      x *= scaleX;
      y *= scaleY;
      h *= scaleY;
      w *= scaleX;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
      canvas.toBlob(function (blob) {
        resolve(blob);
      });
    };
    img.onerror = function () {
      reject(new Error("Failed to load image"));
    };
    img.src = imageUrl;
  });
}

export function PlaygroundPage() {
  const imgRef = useRef();

  const { screens, activeScreen, markers } = useLoaderData();

  const navigate = useNavigate();
  const navigation = useNavigation();

  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [activeId, setActiveId] = useState(null);

  function showMarkerArea() {
    if (imgRef.current !== null) {
      // create a marker.js MarkerArea
      const markerArea = new markerjs2.MarkerArea(imgRef.current);
      markerArea.availableMarkerTypes = ["FrameMarker"];

      // attach an event handler to assign annotated image back to our image element
      markerArea.addEventListener("render", (event) => {
        if (imgRef.current) {
          imgRef.crossOrigin = "anonymous";
          // imgRef.current.src = event.dataUrl;
        }

        // Show the markerArea again
        // markerArea.show();

        // const maState = JSON.parse(localStorage.getItem("maState"));

        const maState = { markers: markers.map((item) => item.dataMatrix) };

        if (maState) {
          markerArea.restoreState(maState);
        }
      });

      markerArea.addEventListener("statechange", async (event) => {
        console.log("State Change", event);

        const state = event.markerArea.getState();

        // for (const m of state.markers) {
        //   console.log(m);
        //   const { data, error } = await supabase
        //     .from("markers")
        //     .update({ dataMatrix: m })
        //     .eq("id", m.notes)
        //     .select();

        //   const currentHeight = event.markerArea.imageHeight;
        //   const currentWidth = event.markerArea.imageWidth;

        //   const image = await cropImage(
        //     activeScreen.imageUrl,
        //     m.left,
        //     m.top,
        //     m.height,
        //     m.width,

        //     currentWidth,
        //     currentHeight
        //   );

        //   console.log(image);

        //   // Now from the image blob get a url of base64
        //   const reader = new FileReader();
        //   reader.readAsDataURL(image);
        //   reader.onloadend = function () {
        //     const base64data = reader.result;
        //     console.log(base64data);
        //   };
        // }
      });

      markerArea.addEventListener("render", async (event) => {
        // Update all markers when we save on the DB
        const state = event.markerArea.getState();

        console.log("Update now", state);
      });

      // launch marker.js
      markerArea.show();

      // const maState = JSON.parse(localStorage.getItem("maState"));

      const maState = { markers: markers.map((item) => item.dataMatrix) };

      console.log({ maState, markers });
      if (maState) {
        markerArea.restoreState(maState);
      }

      markerArea.addEventListener("markercreating", (event) => {
        event.marker.setStrokeColor(getRandomHexColor());

        // event.marker?.manipulationStartState?.notes = "Asdadas";
        console.log(event.marker);
      });

      markerArea.addEventListener("markerdelete", (event) => {
        const state = event.markerArea.getState();
        console.log(state);
        localStorage.setItem("maState", JSON.stringify(state));
      });

      markerArea.addEventListener("markerchange", (event) => {});

      markerArea.addEventListener("markerchange", (event) => {
        const state = event.markerArea.getState();

        // localStorage.setItem("maState", JSON.stringify(state));
      });

      markerArea.addEventListener("markerselect", (event) => {
        console.log("SELECT", event);

        // ActiveNoteId
        setActiveId(event.marker.notes);
      });

      markerArea.addEventListener("markerdeselect", (event) => {
        console.log("SELECT", event);

        // ActiveNoteId
        setActiveId("");
      });

      // markercreate
      markerArea.addEventListener("markercreate", async (event) => {
        const markerId = uuid();
        if (event.marker && !event.marker.notes) event.marker.notes = markerId;

        // Once we have created the marker, we will store in DB
        const state = event.markerArea.getState();

        // Now filter that markerId from the state
        const marker = state.markers.filter((item) => item.notes === markerId);

        // Now we will store the marker in the database of supabase
        const { data, error } = await supabase.from("markers").insert({
          dataMatrix: marker[0],
          screenId: activeScreen.id,
          id: markerId,
        });
      });
    }
  }

  const onClickUpdate = async () => {
    const { data, error } = await supabase
      .from("screens")
      .update({ ...activeScreen })
      .eq("id", activeScreen.id)
      .select();
  };

  console.log({ imageDimensions });

  return (
    <Wrapper>
      {navigation.state === "loading" && (
        <FullPageLoading>
          <LoadingSpinner />
        </FullPageLoading>
      )}
      <div className="flex h-16 items-center px-4 border bordewr-[#27272f]">
        <div className="h-7 rounded-full flex">
          <img
            className="aspect-square h-full w-full  rounded-full grayscale"
            alt="Alicia Koch"
            src="https://avatar.vercel.sh/personal.png"
          />
          <p className="ml-3 font-bold">Logo</p>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <a
            className="text-sm font-medium transition-colors hover:text-primary"
            href="/examples/dashboard"
          >
            Username / Project Name
          </a>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <button
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-8 rounded-full"
            type="button"
            id="radix-:rgb:"
            aria-haspopup="menu"
            aria-expanded="false"
            data-state="closed"
          >
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
              <img
                className="aspect-square h-full w-full"
                alt="@shadcn"
                src="/avatars/01.png"
              />
            </span>
          </button>
        </div>
      </div>
      <div className="flex h-screen">
        <div className=" bg-[#111] h-full" style={{ width: "12%" }}>
          <h1 className=" p-2 px-6 font-bold text-sm">Screens</h1>

          <Button className="w-full" variant={"ghost"}>
            + Add New Screen
          </Button>

          {screens &&
            screens.map((scr) => {
              return (
                <div
                  key={scr.id}
                  onClick={() => {
                    navigate(`/${scr.id}`);
                  }}
                  className="py-2 px-6 text-sm bg-[#222] rounded-sm mx-3 my-2 flex  items-center justify-between hover:bg-[#333] cursor-pointer transition-all duration-200 ease-in-out"
                >
                  {scr.name}

                  <svg
                    fill="#fff"
                    height="16px"
                    width="16px"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32.055 32.055"
                  >
                    <g>
                      <path
                        d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967
		C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967
		s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967
		c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"
                      />
                    </g>
                  </svg>
                </div>
              );
            })}
        </div>

        <div className="flex-1  flex h-full justify-center items-center">
          {activeScreen && (
            <img
              className="w-11/12"
              ref={imgRef}
              onLoad={() => {
                const img = imgRef.current;
                setImageDimensions({
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
              }}
              crossOrigin="anonymous"
              onClick={() => showMarkerArea()}
              src={activeScreen.imageUrl}
            />
          )}
        </div>

        {activeId && (
          <div className="w-2/12 border-l-2">
            <CardHeader className="my-2 space-0 space-x-0 space-y-0 px-5 py-2">
              <CardTitle className="text-md border-b-2 py-2 m-0 space-0">
                Options for section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="screen-name" className="text-sm">
                  Screen Name
                </Label>
                <Input id="screen-name" placeholder="Enter the screen name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="screen-description">Screen Description</Label>
                <Textarea
                  className="min-h-[100px]"
                  id="screen-description"
                  placeholder="Enter the screen description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permission-access">Type</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      id="permission-access"
                      placeholder="What type of component is it?"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Label">Label</SelectItem>
                      <SelectItem value="Button">Button</SelectItem>
                      <SelectItem value="Text">Text</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant={"secondary"} className="ml">
                Delete
              </Button>
              <Button className="ml-auto">Save</Button>
            </CardFooter>
          </div>
        )}

        {activeScreen && !activeId && (
          <ScreenOptions activeScreen={activeScreen} />
        )}
      </div>
    </Wrapper>
  );
}
