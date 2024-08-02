import { cn } from "@/lib/utils";

import Image from "next/image";

interface HeadingProps {
  title: string;
  description: string;
  imageSrc: string;
  bgColor?: string;
}

const Heading = ({
  title,
  description,
  imageSrc,
  bgColor,
}: HeadingProps) => {
  return (
    <>
      <div className="px-4 lg:px-4 flex items-center gap-x-3 mb-8">
        <div className={cn("p-2 w-fit rounded-md", bgColor)}>
          <Image width={50} height={50} src={imageSrc} alt={title}  />
        </div>
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </>
  );
};
export default Heading;