import clsx from "clsx";

const Card = ({
  contentType,
  title,
  description,
  keywords,
  audience,
  tone,
  outline,
  imagePrompt,
  images,
}: {
  contentType: string;
  title: string;
  description: string;
  keywords: string[];
  audience: string[];
  tone: string;
  outline: string[];
  imagePrompt: string;
  images?: {
    name: string;
    url: string;
  }[];
}) => {
  const badgeColors = [
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-green-50 text-green-700 border-green-200",
    "bg-yellow-50 text-yellow-700 border-yellow-200",
    "bg-red-50 text-red-700 border-red-200",
    "bg-indigo-50 text-indigo-700 border-indigo-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-pink-50 text-pink-700 border-pink-200",
    "bg-gray-50 text-gray-700 border-gray-200",
  ];

  return (
    <article className=" bg- animate-background rounded-xl border border-gray-200 bg-[length:400%_400%] shadow-md transition [animation-duration:_6s] hover:border-gray-300 hover:shadow-xl">
      <div className="overflow-hidden rounded-[10px] bg-white">
        {images && images?.length > 0 && <img alt={title} src={images[0].url} className="h-32 w-full border-b border-gray-200 object-cover" />}

        <div className="p-4 sm:p-6">
          <time className="block text-xs font-medium uppercase text-gray-500">{contentType}</time>

          <h3 className="mt-0.5 text-lg font-medium text-gray-900">{title}</h3>

          <div className="mt-2 line-clamp-5 text-sm text-gray-500">
            <p>{description}</p>
          </div>

          <div className="mt-4 space-y-1">
            <div className="block text-xs font-medium uppercase text-gray-500">Keywords</div>
            <div className="flex flex-wrap gap-1">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className={clsx(
                    "whitespace-nowrap rounded-md border px-1.5 py-0.5 text-xs capitalize",
                    badgeColors[Math.floor(Math.random() * badgeColors.length)]
                  )}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="block text-xs font-medium uppercase text-gray-500">Audience</div>
            <div className="flex flex-wrap gap-1">
              {audience.map((audience) => (
                <span
                  key={audience}
                  className={clsx("whitespace-nowrap rounded-md border px-1.5 py-0.5 text-xs capitalize", "border-gray-200 bg-gray-50 text-gray-700")}
                >
                  {audience}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="block text-xs font-medium uppercase text-gray-500">Tone</div>
            <div>
              <span
                className={clsx(
                  "whitespace-nowrap rounded-md border px-1.5 py-0.5 text-xs capitalize",
                  badgeColors[Math.floor(Math.random() * badgeColors.length)]
                )}
              >
                {tone}
              </span>
            </div>
          </div>

          <div className="prose mt-4 space-y-1">
            <div className="block text-xs font-medium uppercase text-gray-500">Image Prompt</div>
            <p className="text-sm text-gray-500">{imagePrompt}</p>
          </div>

          <div className="prose mt-4 space-y-1">
            <div className="block text-xs font-medium uppercase text-gray-500">Outline</div>
            <ol className="text-sm text-gray-500">
              {outline.map((step, idx) => {
                return <li key={idx}>{step}</li>;
              })}
            </ol>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
