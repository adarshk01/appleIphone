import { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";

export function VideoCarousel() {
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);

  const [loadedData, setLoadedData] = useState<any[]>([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      const videoElement = videoRef.current[videoId];

      if (videoElement) {
        if (!isPlaying) {
          videoElement.pause();
        } else {
          startPlay && videoElement.play();
        }
      }
    }
  }, [videoId, startPlay, isPlaying, loadedData]);

  const handleLoadedMetaData = (i: any, e: any) =>
    setLoadedData((pre) => [...pre, e]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (currentProgress != progress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });
      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        const videoElement: any = videoRef.current[videoId]?.currentTime;
        const slideDur: any = hightlightsSlides[videoId].videoDuration;
        anim.progress(videoElement / slideDur);
      };
      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  function handleProcess(type: string, i: number) {
    switch (type) {
      case "video-end":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isEnd: true,
          videoId: i + 1,
        }));
        break;

      case "video-last":
        setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: true }));
        break;

      case "video-reset":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: false,
          videoId: 0,
        }));
        break;

      case "play":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;
    }
  }

  return (
    <div>
      <div className="flex items-center">
        {hightlightsSlides.map((i, index) => {
          return (
            <div key={i.id} id="slider" className="sm:pr-20 pr-10">
              <div className="video-carousel_container">
                <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                  <video
                    id="video"
                    playsInline={true}
                    preload="auto"
                    muted
                    ref={(el) => {
                      videoRef.current[index] = el;
                    }}
                    onEnded={() => {
                      index !== 3
                        ? handleProcess("video-end", index)
                        : handleProcess("video-last", index);
                    }}
                    onPlay={() => {
                      setVideo((prevVid) => ({ ...prevVid, isPlaying: true }));
                    }}
                    onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                  >
                    <source src={i.video} type="video/mp4" />
                  </video>
                </div>
                <div className="absolute top-12 left-[5%] z-10">
                  {i.textLists.map((text) => {
                    return (
                      <p key={text} className="md:text-2xl text-xl font-medium">
                        {text}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => {
            return (
              <span
                key={i}
                ref={(el) => (videoDivRef.current[i] = el)}
                className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              >
                <span
                  className="absolute h-full w-full rounded-full"
                  ref={(el) => (videoSpanRef.current[i] = el)}
                />
              </span>
            );
          })}
        </div>
        <button
          className="control-btn"
          onClick={
            isLastVideo
              ? () => handleProcess("video-reset")
              : !isPlaying
              ? () => handleProcess("play")
              : () => handleProcess("pause")
          }
        >
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt=""
          />
        </button>
      </div>
    </div>
  );
}
