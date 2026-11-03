import { FormBlocksType } from "@/@types/form-block.type";
import { HeadingBlock } from "@/components/blocks/HeadingBlock";
import { RowLayoutBlock } from "@/components/blocks/layouts/RowLayout";
import { ColumnsLayoutBlock } from "@/components/blocks/layouts/ColumnsLayout";
import { ParagraphBlock } from "@/components/blocks/ParagraphBlock";
import { RadioSelectBlock } from "@/components/blocks/RadioSelectBlock";
import { StarRatingBlock } from "@/components/blocks/StarRatingBlock";
import { TextAreaBlock } from "@/components/blocks/TextAreaBlock";
import { TextFieldBlock } from "@/components/blocks/TextField";
import { CheckboxBlock } from "@/components/blocks/CheckboxBlock";
import { SelectBlock } from "@/components/blocks/SelectBlock";
import { SeparatorBlock } from "@/components/blocks/SeparatorBlock";
import { SpacerBlock } from "@/components/blocks/SpacerBlock";
import { DatePickerBlock } from "@/components/blocks/DatePickerBlock";

export const FormBlocks: FormBlocksType = {
  RowLayout: RowLayoutBlock,
  ColumnsLayout: ColumnsLayoutBlock,
  Heading: HeadingBlock,
  Paragraph: ParagraphBlock,
  TextField: TextFieldBlock,
  TextArea: TextAreaBlock,
  RadioSelect: RadioSelectBlock,
  StarRating: StarRatingBlock,
  Checkbox: CheckboxBlock,
  Select: SelectBlock,
  Separator: SeparatorBlock,
  Spacer: SpacerBlock,
  DatePicker: DatePickerBlock,
};
