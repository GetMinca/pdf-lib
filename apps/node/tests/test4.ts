import { Assets } from '..';
import {
  PDFDocument,
  PDFPage,
  radians,
  StandardFonts,
  ParseSpeeds,
} from '../../..';

export default async (assets: Assets) => {
  const { pdfs, images } = assets;

  const pdfDoc = await PDFDocument.load(pdfs.normal_base64, {
    parseSpeed: ParseSpeeds.Fastest,
  });

  const minionsLaughingImage = pdfDoc.embedJpg(images.jpg.minions_laughing);
  const minionsLaughingDims = minionsLaughingImage.scale(0.6);

  const firstPage = pdfDoc.getPages()[0];
  const middlePage = pdfDoc.insertPage(1, [600, 500]);
  const lastPage = pdfDoc.getPages()[2];

  const fontSize = 20;
  middlePage.setFontSize(fontSize);
  middlePage.moveTo(0, middlePage.getHeight());

  Object.keys(StandardFonts).forEach((fontName: any, idx) => {
    middlePage.moveDown(fontSize);
    const font = pdfDoc.embedFont(StandardFonts[fontName] as StandardFonts);
    middlePage.setFont(font);

    // prettier-ignore
    const text = (
        fontName === StandardFonts.Symbol ? `${idx + 1}. Τηεσε αρε τηε 14 Στανδαρδ Φοντσ.`
      : fontName === StandardFonts.ZapfDingbats ? `✑✔✎ ✴❈❅▲❅ ❁❒❅ ▼❈❅ ✑✔ ✳▼❁■❄❁❒❄ ✦❏■▼▲✎`
      : `${idx + 1}. These are the 14 Standard Fonts.`
    );

    middlePage.drawText(text, {
      rotate: radians(-Math.PI / 6),
      xSkew: radians(Math.PI / 10),
      ySkew: radians(Math.PI / 10),
    });
  });

  const stampImage = (page: PDFPage) => {
    const { width, height } = page.getSize();
    const centerX = width / 2;
    const centerY = height / 2;
    page.drawImage(minionsLaughingImage, {
      ...minionsLaughingDims,
      x: centerX - minionsLaughingDims.width / 2,
      y: centerY - minionsLaughingDims.height / 2,
    });
  };

  stampImage(firstPage);
  stampImage(lastPage);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
