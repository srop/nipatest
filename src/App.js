import "./App.css";

import React, { useEffect, useRef, useState } from "react";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

const App = () => {
  const useStyles = makeStyles(theme => ({
    root: {
      maxWidth: 500,
      textAlign: "center"
    },
    media: {
      height: 140
    }
  }));
  let ctx = null;
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [response, setResponse] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [requestedMedia, setRequestedMedia] = useState(false);

  useEffect(() => {
    if (response) {
      const canvasEle = photoRef.current;
      canvasEle.width = canvasEle.clientWidth;
      canvasEle.height = canvasEle.clientHeight;

      // get context of the canvas
      ctx = canvasEle.getContext("2d");
      let leng = Object.keys(response.detected_objects).length;
      var background = new Image();
      background.src = imgUrl;
      for (let i = 0; i < leng; i++) {
        //   const r1Info = { bottom: 150, left: 1, right: 289, top: 34 };

        const r1Info = Object.values(response.detected_objects)[i].bounding_box;

        const r1Style = { borderColor: "red", borderWidth: 2 };
        const { bottom, left, right, top } = r1Info;

        // ctx.beginPath();
        ctx.strokeStyle = r1Style.borderColor;
        ctx.lineWidth = r1Style.borderWidth;
        ctx.rect(left, top, right, bottom);
        ctx.stroke();

        //drawRect(r1Info, r1Style);
      }
      // console.log(background);
      ctx.drawImage(background, 0, 0, 300, 120);
      // const r1Info = { bottom: 150, left: 1, right: 289, top: 34 };
    }
  }, [response]);

  useEffect(() => {
    if (!videoRef) {
      return;
    }

    if (requestedMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: requestedMedia })
        .then(stream => {
          let video = videoRef.current;
          video.srcObject = stream;

          video.play();
        });
    } else {
    }
  }, [videoRef, requestedMedia]);

  const capturePicture = () => {
    const context = photoRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 300, 150);
    let photo = photoRef.current;

    const data = photo.toDataURL("image/jpeg");

    setImgUrl(data);
  };

  const handelUpload = () => {
    if (imgUrl) {
      const base64String = imgUrl.replace("data:", "").replace(/^.+,/, "");

      const url = "https://nvision.nipa.cloud/api/v1/object-detection";
      const ApiKey =
        "cdb29f355cb4059995e05420dc8d963f657898bf3a5f2f5e7a88c58279f5e4a0a1c4c4cf874594b42e413fc45c425425ac";
      const data = {
        raw_data: base64String
        // row_data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCACWASwDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k='
      };

      const options = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: "ApiKey " + ApiKey
        }
      };
      axios
        .post(url, data, options)

        .then(res => {
          setResponse(res.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <div>{requestedMedia && <video ref={videoRef} />}</div>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={3}
            >
              <Button
                size="small"
                color="primary"
                variant="contained"
                style={{ margin: "10px" }}
                onClick={() => setRequestedMedia(true)}
              >
                Open Camera
              </Button>

              <Button
                size="small"
                color="secondary"
                variant="contained"
                style={{ margin: "10px" }}
                onClick={() => setRequestedMedia(false)}
              >
                Close Camera
              </Button>

              <Button
                size="small"
                variant="contained"
                style={{ margin: "10px" }}
                onClick={capturePicture}
                disabled={!requestedMedia}
              >
                Capture
              </Button>
            </Grid>

            <div style={{ padding: "10px" }}>
              <canvas ref={photoRef} />
            </div>

            <Button
              size="small"
              color="default"
              variant="contained"
              onClick={handelUpload}
              disabled={imgUrl === null ? true : false}
            >
              upload image
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default App;
