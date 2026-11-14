import { Config } from "@remotion/cli/config";

Config.setEntryPoint("src/index.ts");
// a porta 3000 é do site (next dev); o Remotion usa outras
Config.setStudioPort(3200);
Config.setRendererPort(3100);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec("h264");
// 20: imagem limpa a ~7 Mbps (o YouTube recomenda 8 Mbps para 1080p); menor = mais qualidade e arquivo maior
Config.setCrf(20);
Config.setPixelFormat("yuv420p");
Config.setAudioBitrate("320k");
// usa a placa de vídeo para desenhar os quadros (bem mais rápido com desfoques e degradês)
Config.setChromiumOpenGlRenderer("angle");
