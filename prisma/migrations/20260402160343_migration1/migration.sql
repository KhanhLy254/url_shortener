-- CreateTable
CREATE TABLE "UrlShortener" (
    "id" SERIAL NOT NULL,
    "original" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UrlShortener_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClickLog" (
    "id" TEXT NOT NULL,
    "urlId" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClickLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UrlShortener_original_key" ON "UrlShortener"("original");

-- CreateIndex
CREATE UNIQUE INDEX "UrlShortener_shortUrl_key" ON "UrlShortener"("shortUrl");

-- AddForeignKey
ALTER TABLE "ClickLog" ADD CONSTRAINT "ClickLog_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "UrlShortener"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
