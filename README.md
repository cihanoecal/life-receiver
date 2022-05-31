
<img src="https://raw.githubusercontent.com/cihanoecal/life-receiver/master/app-res-logo-black.svg" width="300" align="right" alt=""/>

Live Free Video Experience (LiFE) Receiver 4 Fun & More
============================

This is **LiFE Receiver**, the trainee client-side desktop application
(for Windows and macOS) for receiving a live video-stream and event-stream of a training
via a central [LiVE Relay](https://github.com/rse/live-relay) service from a
trainer running the [LiVE Sender](https://github.com/rse/live-sender) side
with less restrictions than the original project.

*Live Video Experience (LiVE)* is a training broadcasting setup
developed by <i>Dr. Ralf S. Engelschall</i> and
consisting of three particular components:

- [**LiVE Sender**](https://github.com/rse/live-sender):
  This component is run at the trainer-side of a LiVE session,
  sends the live video-stream via RTMPS to the LiVE Relay
  and receives the live event-stream via MQTTS from the LiVE Relay.~~~~
  It is primarily based on the Open Source software components
  [Open Broadcaster Software (OBS) Studio](https://obsproject.com/),
  the [Head-Up-Display Server (HUDS)](https://github.com/rse/huds), and
  its [Training HUD](https://github.com/rse/huds-hud-training/).

- [**LiVE Relay**](https://github.com/rse/live-relay):
  This component is run at the server-side of a LiVE session
  and relays the RTMPS video-stream and MQTTS event-stream betweeen the
  trainer and the trainees. It is primarily based
  on the Open Source software components
  [SRS](https://ossrs.net/srs.release/releases/) for RTMPS
  and [Mosquitto](https://mosquitto.org/) for MQTTS.

- [**LiFE Receiver**](https://github.com/cihanoecal/life-receiver):
  This component is run at the trainee-side of a LiFE session,
  receives the live video-stream via RTMPS from the LiVE Relay
  and sends the live event-stream via MQTTS to the LiVE Relay.
  It is primarily based on the Open Source software components
  [Electron](https://www.electronjs.org/) and [FFMpeg](https://ffmpeg.org/).

Copyright & License
-------------------

Live Free Video Experience (LiFE) Receiver 4 Fun & More<br/>
Copyright &copy; 2022 [Cihan Öcal](mailto:cihanoecal@tuta.io)<br/>
Licensed under [GPL 3.0](https://spdx.org/licenses/GPL-3.0-only) <br />

Special Thanks
-------------------
Special thanks to everyone involved in this great project, especially to 
[Dr. Ralf S. Engelschall](mailto:rsa@engelschall.com) who created this
great software on [GitHub](https://github.com/rse/live-receiver). 
