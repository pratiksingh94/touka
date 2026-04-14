import type {
  PacketDetails,
  PacketField,
  SelectedField,
} from "@/views/PacketDetail/types";

function findFieldInDetails(
  fields: PacketField[],
  offset: number,
): PacketField | null {
  for (const field of fields) {
    if (field.offset !== undefined && field.length !== undefined) {
      if (offset >= field.offset && offset < field.offset + field.length) {
        return field;
      }
    }
    if (field.children) {
      const found = findFieldInDetails(field.children, offset);
      if (found) return found;
    }
  }

  return null;
}

export function findFieldAtOffset(
  protocols: PacketDetails[],
  byteOffset: number,
): SelectedField {
  for (const protocol of protocols) {
    if (
      byteOffset >= protocol.offset &&
      byteOffset < protocol.offset + protocol.length
    ) {
      const relativeOffset = byteOffset - protocol.offset;
      const field = findFieldInDetails(protocol.fields, relativeOffset);
      if (field && field.offset !== undefined && field.length !== undefined) {
        return {
          offset: field.offset + protocol.offset,
          length: field.length,
        };
      }

      return { offset: protocol.offset, length: protocol.length };
    }
  }

  return { offset: byteOffset, length: 1 };
}
