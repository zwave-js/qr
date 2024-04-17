import QRCode from "qrcode-svg";
import {
  QRCodeVersion,
  QRProvisioningInformation as QRProvisioningInformationFull,
  SecurityClass,
  ProvisioningInformationType,
  Protocols,
  isValidDSK,
} from "./zwave_defs";

const Z = "Z".charCodeAt(0);

/** Writes a number between 0 and 99 (2 decimal digits) */
function level(val: number): string {
  if (val < 0 || val > 99) throw new Error("Value must be between 0 and 99");
  return val.toString(10).padStart(2, "0");
}

/** Writes a byte (3 decimal digits) */
function uint8(val: number): string {
  if (val < 0 || val > 255) throw new Error("Value must be between 0 and 255");
  return val.toString(10).padStart(3, "0");
}

/** Writes a 2-byte value (5 decimal digits) */
function uint16(val: number): string {
  if (val < 0 || val > 65535)
    throw new Error("Value must be between 0 and 65535");
  return val.toString(10).padStart(5, "0");
}

function encodeTLV(
  type: ProvisioningInformationType,
  critical: boolean,
  data: string
): string {
  const typeCritical = (type << 1) | (critical ? 1 : 0);
  return `${level(typeCritical)}${level(data.length)}${data}`;
}

/** Serializes a numeric array with a given maximum into a bit mask */
function encodeBitMask(
  values: readonly number[],
  maxValue: number = Math.max(...values),
  startValue: number = 1
): number {
  let ret = 0;
  for (let val = startValue; val <= maxValue; val++) {
    if (!values.includes(val)) continue;
    ret |= 2 ** (val - startValue);
  }
  return ret;
}

function dskFromString(dsk: string): number[] {
  if (!isValidDSK(dsk)) {
    throw new Error(
      `The DSK must be in the form "aaaaa-bbbbb-ccccc-ddddd-eeeee-fffff-11111-22222"`
    );
  }

  return dsk.split("-").map((part) => parseInt(part, 10));
}

function hexToBytes(hex: string): number[] {
  let bytes: number[] = [];
  for (let c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.slice(c, c + 2), 16));
  return bytes;
}

export type QRProvisioningInformation = Omit<
  QRProvisioningInformationFull,
  "requestedSecurityClasses"
>;

export async function generateQRCode(
  info: QRProvisioningInformation,
  size: number = 256
): Promise<{ text: string; svg: string }> {
  const partsAfterChecksum: string[] = [];

  const securityClasses = uint8(
    encodeBitMask(
      info.securityClasses,
      undefined,
      SecurityClass.S2_Unauthenticated
    )
  );
  partsAfterChecksum.push(securityClasses);

  const dsk = dskFromString(info.dsk).map((part) => uint16(part));
  partsAfterChecksum.push(...dsk);

  const productType = encodeTLV(
    ProvisioningInformationType.ProductType,
    false,
    [
      uint16((info.genericDeviceClass << 8) | info.specificDeviceClass),
      uint16(info.specificDeviceClass),
    ].join("")
  );
  partsAfterChecksum.push(productType);

  const applicationVersion = info.applicationVersion
    .split(".", 2)
    .map((part) => parseInt(part, 10));
  const productId = encodeTLV(
    ProvisioningInformationType.ProductId,
    false,
    [
      uint16(info.manufacturerId),
      uint16(info.productType),
      uint16(info.productId),
      uint16((applicationVersion[0] << 8) | applicationVersion[1]),
    ].join("")
  );
  partsAfterChecksum.push(productId);

  if (info.maxInclusionRequestInterval !== undefined) {
    const maxInclusionRequestInterval = encodeTLV(
      ProvisioningInformationType.MaxInclusionRequestInterval,
      false,
      uint16(info.maxInclusionRequestInterval)
    );
    partsAfterChecksum.push(maxInclusionRequestInterval);
  }

  if (info.uuid !== undefined) {
    const bytes = hexToBytes(info.uuid);
    const words: number[] = [];
    for (let i = 0; i < bytes.length; i += 2) {
      // TODO: Check if this is correct or if we need to reverse the bytes
      words.push((bytes[i] << 8) | bytes[i + 1]);
    }
    const uuid = encodeTLV(
      ProvisioningInformationType.UUID16,
      false,
      words.map((w) => uint16(w)).join("")
    );
    partsAfterChecksum.push(uuid);
  }

  if (info.supportedProtocols !== undefined) {
    const supportedProtocols = encodeTLV(
      ProvisioningInformationType.SupportedProtocols,
      false,
      level(encodeBitMask(info.supportedProtocols, undefined, Protocols.ZWave))
    );
    partsAfterChecksum.push(supportedProtocols);
  }

  // Other TLV types are not supported yet

  // Calculate the checksum, first 16 bits of the SHA1 of the rest
  const textAfterChecksum = partsAfterChecksum.join("");
  const checksumData = new TextEncoder().encode(textAfterChecksum);
  const checksumBuffer = Array.from(
    new Uint8Array(await window.crypto.subtle.digest("SHA-1", checksumData))
  );
  const checksum = (checksumBuffer[0] << 8) | checksumBuffer[1];

  const text = `${level(Z)}${level(info.version)}${uint16(
    checksum
  )}${textAfterChecksum}`;
  const svg = new QRCode({
    content: text,
    container: "none",
    xmlDeclaration: false,
    width: size,
    height: size,
  }).svg();

  return { text, svg };
}

const chkS2AccessControl = document.getElementById(
  "security-class_s2-access"
) as HTMLInputElement;
const chkS2Authenticated = document.getElementById(
  "security-class_s2-authenticated"
) as HTMLInputElement;
const chkS2Unauthenticated = document.getElementById(
  "security-class_s2-unauthenticated"
) as HTMLInputElement;
const chkS0 = document.getElementById("security-class_s0") as HTMLInputElement;

const chkProtocol = document.getElementById("protocol") as HTMLInputElement;
const chkProtocolZWave = document.getElementById(
  "protocol_zwave"
) as HTMLInputElement;
const chkProtocolZWaveLR = document.getElementById(
  "protocol_zwlr"
) as HTMLInputElement;

const txtDSK = document.getElementById("dsk") as HTMLInputElement;

const txtDeviceClassGeneric = document.getElementById(
  "device-class_generic"
) as HTMLInputElement;
const txtDeviceClassSpecific = document.getElementById(
  "device-class_specific"
) as HTMLInputElement;
const txtDeviceClassIcon = document.getElementById(
  "device-class_icon"
) as HTMLInputElement;
const lblDeviceClassGenericHex = document.getElementById(
  "device-class_generic_hex"
) as HTMLSpanElement;
const lblDeviceClassSpecificHex = document.getElementById(
  "device-class_specific_hex"
) as HTMLSpanElement;
const lblDeviceClassIconHex = document.getElementById(
  "device-class_icon_hex"
) as HTMLSpanElement;

const txtManufacturerId = document.getElementById(
  "manufacturer-id"
) as HTMLInputElement;
const txtProductType = document.getElementById(
  "product-type"
) as HTMLInputElement;
const txtProductId = document.getElementById("product-id") as HTMLInputElement;
const txtVersionMajor = document.getElementById(
  "version-major"
) as HTMLInputElement;
const txtVersionMinor = document.getElementById(
  "version-minor"
) as HTMLInputElement;
const lblManufacturerIdHex = document.getElementById(
  "manufacturer-id_hex"
) as HTMLSpanElement;
const lblProductTypeHex = document.getElementById(
  "product-type_hex"
) as HTMLSpanElement;
const lblProductIdHex = document.getElementById(
  "product-id_hex"
) as HTMLSpanElement;

const lblErrorMessage = document.getElementById(
  "error-message"
) as HTMLDivElement;

const btnGenerate = document.getElementById("generate") as HTMLButtonElement;

const lblQRText = document.getElementById(
  "qr-code-text"
) as HTMLTextAreaElement;
const svgQRCode = document.getElementById("qr-code")!;

function parseDecimal(elem: HTMLInputElement): number | undefined {
  const value = elem.value.trim();
  if (/^[0-9]+$/.test(value)) {
    return parseInt(value, 10);
  }
  return undefined;
}

function parseHexOrDecimal(elem: HTMLInputElement): number | undefined {
  const value = elem.value.trim();
  if (/^[0-9]+$/.test(value)) {
    return parseInt(value, 10);
  } else if (/^(0x)?[0-9a-fA-F]+$/.test(value)) {
    if (value.startsWith("0x")) {
      return parseInt(value.slice(2), 16);
    } else {
      return parseInt(value, 16);
    }
  }
  return undefined;
}

function onProtocolToggled() {
  chkProtocolZWave.disabled = !chkProtocol.checked;
  chkProtocolZWaveLR.disabled = !chkProtocol.checked;
  update();
}

function onTextboxChangedHex(txt: HTMLInputElement, lbl: HTMLSpanElement) {
  let value = parseHexOrDecimal(txt);
  const min = parseInt(txt.min);
  const max = parseInt(txt.max);

  if (value === undefined) {
    lbl.innerText = "(invalid)";
  } else {
    value = Math.min(max, Math.max(min, value));
    lbl.innerText = "0x" + value.toString(16).padStart(4, "0");
  }
}

function onTextboxBlurHex(txt: HTMLInputElement, lbl: HTMLSpanElement) {
  let value = parseHexOrDecimal(txt);
  const min = parseInt(txt.min);
  const max = parseInt(txt.max);
  if (value === undefined) {
    txt.value = txt.min;
    lbl.innerText = "0x" + parseInt(txt.min).toString(16).padStart(4, "0");
  } else {
    value = Math.min(max, Math.max(min, value));
    // Format the value as decimal
    txt.value = value.toString(10);
    lbl.innerText = "0x" + value.toString(16).padStart(4, "0");
    update();
  }
}

function onTextboxBlurDecimal(txt: HTMLInputElement) {
  let value = parseDecimal(txt);
  const min = parseInt(txt.min);
  const max = parseInt(txt.max);
  if (value === undefined) {
    txt.value = txt.min;
  } else {
    value = Math.min(max, Math.max(min, value));
    txt.value = value.toString(10);

    update();
  }
}

function tryParse(): QRProvisioningInformation | undefined {
  const securityClasses: SecurityClass[] = [];
  if (chkS2AccessControl.checked)
    securityClasses.push(SecurityClass.S2_AccessControl);
  if (chkS2Authenticated.checked)
    securityClasses.push(SecurityClass.S2_Authenticated);
  if (chkS2Unauthenticated.checked)
    securityClasses.push(SecurityClass.S2_Unauthenticated);
  if (chkS0.checked) securityClasses.push(SecurityClass.S0_Legacy);

  let supportedProtocols: Protocols[] | undefined;
  if (chkProtocol.checked) {
    supportedProtocols = [];
    if (chkProtocolZWave.checked) supportedProtocols.push(Protocols.ZWave);
    if (chkProtocolZWaveLR.checked)
      supportedProtocols.push(Protocols.ZWaveLongRange);
  }

  const dsk = txtDSK.value.trim();
  if (!isValidDSK(dsk)) {
    lblErrorMessage.innerText =
      "The DSK is not valid. It must be in the form 'xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx' with each block between 0 and 65535.";
    return;
  }

  const genericDeviceClass = parseHexOrDecimal(txtDeviceClassGeneric);
  if (genericDeviceClass === undefined) {
    lblErrorMessage.innerText = "The generic device class must be a number";
    return;
  }
  const specificDeviceClass = parseHexOrDecimal(txtDeviceClassSpecific);
  if (specificDeviceClass === undefined) {
    lblErrorMessage.innerText = "The specific device class must be a number";
    return;
  }
  const installerIconType = parseHexOrDecimal(txtDeviceClassIcon);
  if (installerIconType === undefined) {
    lblErrorMessage.innerText = "The installer icon type must be a number";
    return;
  }

  const manufacturerId = parseHexOrDecimal(txtManufacturerId);
  if (manufacturerId === undefined) {
    lblErrorMessage.innerText = "The manufacturer ID must be a number";
    return;
  }
  const productType = parseHexOrDecimal(txtProductType);
  if (productType === undefined) {
    lblErrorMessage.innerText = "The product type must be a number";
    return;
  }
  const productId = parseHexOrDecimal(txtProductId);
  if (productId === undefined) {
    lblErrorMessage.innerText = "The product ID must be a number";
    return;
  }

  const versionMajor = parseDecimal(txtVersionMajor);
  if (versionMajor === undefined) {
    lblErrorMessage.innerText = "The major version must be a number";
    return;
  }
  const versionMinor = parseDecimal(txtVersionMinor);
  if (versionMinor === undefined) {
    lblErrorMessage.innerText = "The minor version must be a number";
    return;
  }
  const applicationVersion = `${versionMajor}.${versionMinor}`;

  const info: QRProvisioningInformation = {
    version: QRCodeVersion.SmartStart,
    securityClasses,
    supportedProtocols,
    dsk,
    genericDeviceClass,
    specificDeviceClass,
    manufacturerId,
    productType,
    productId,
    installerIconType,
    applicationVersion,
  };

  return info;
}

async function update() {
  const info = tryParse();
  if (!info) {
    btnGenerate.disabled = true;
    return;
  } else {
    btnGenerate.disabled = false;
  }

  const { text, svg } = await generateQRCode(
    info,
    svgQRCode.clientWidth || svgQRCode.clientHeight
  );

  lblQRText.value = text;
  svgQRCode.innerHTML = svg;
}

// Update when the checkboxes are toggled
for (const chk of [
  chkS0,
  chkS2AccessControl,
  chkS2Authenticated,
  chkS2Unauthenticated,
  chkProtocolZWave,
  chkProtocolZWaveLR,
]) {
  chk.addEventListener("change", update);
}

// Update when the supported protocols are enabled or disabled
chkProtocol.addEventListener("change", onProtocolToggled);

// Update the QR code and helper labels when a hexadecimal textbox is changed
for (const [txt, lbl] of [
  [txtDeviceClassGeneric, lblDeviceClassGenericHex],
  [txtDeviceClassSpecific, lblDeviceClassSpecificHex],
  [txtDeviceClassIcon, lblDeviceClassIconHex],
  [txtManufacturerId, lblManufacturerIdHex],
  [txtProductType, lblProductTypeHex],
  [txtProductId, lblProductIdHex],
] as const) {
  txt.addEventListener("input", () => onTextboxChangedHex(txt, lbl));
  txt.addEventListener("blur", () => onTextboxBlurHex(txt, lbl));
}

// Update the QR code when a decimal textbox is changed and left
for (const txt of [txtVersionMajor, txtVersionMinor]) {
  txt.addEventListener("blur", () => onTextboxBlurDecimal(txt));
}

txtDSK.onblur = update;

btnGenerate.onclick = update;
