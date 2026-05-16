# Шилний данс web app

Энэ хавтас нь 2 төрлийн шилний борлуулалт, үлдэгдэл, орлогыг PC болон утаснаас браузераар нээж ашиглах зориулалттай жижиг web app юм.

## Онцлог

- `1370 x 2200 x 4 мм` болон `1500 x 2000 x 4 мм` гэсэн 2 төрлийн шил
- Төрөл тус бүр `12 авдар x 82 ширхэг = 984 ширхэг` эхний нөөцтэй
- `ADMIN` болон `Худалдааны менежер` гэсэн 2 эрх
- `ADMIN` нь худалдааны менежерийн эрх, нэвтрэх кодыг нэмж/засаж/устгаж чадна
- Шинэ мөр нэмэх, засах, устгах
- Борлуулсан тоо, үлдэгдэл, нийт орлого автоматаар тооцно
- Responsive UI: компьютер, таблет, утаснаас нээнэ
- Public domain дээр байршуулбал энгийн интернэт хөтчөөр шууд орж үзнэ

## Ажиллуулах

`D:\shaj\codex-projects\emlid\glass-ledger` хавтас дотор:

```powershell
node server.js
```

эсвэл

```powershell
npm start
```

Сервер асмагц console дээр дараах мэдээлэл гарна:

- `ADMIN code configured` `(masked)`
- `Manager accounts configured`
- `http://localhost:3187`
- тухайн PC-ийн дотоод сүлжээний IP хаягууд

## Утаснаас нээх

1. PC дээр серверээ асаана.
2. PC болон утсаа нэг Wi-Fi сүлжээнд холбоно.
3. Console дээр гарсан `http://192.168.x.x:3187` шиг хаягийг утасныхаа браузерт нээнэ.

## Интернэтээр нээх

Хэрвээ зөвхөн дотоод Wi‑Fi биш, хаанаас ч browser-оор нээдэг болгох бол энэ app-ийг online host дээр байршуулна.

Хамгийн амар зам нь `Railway`.

## Railway-д бэлэн болгосон зүйл

- `server.js` нь `GLASS_LEDGER_DATA_DIR` байхгүй үед Railway-ийн `RAILWAY_VOLUME_MOUNT_PATH`-ийг автоматаар танина
- `railway.json` файл нь `start command`, `healthcheck`, `restart policy`, `required volume mount path`-ийг урьдчилж тохируулсан
- `/api/health` endpoint Railway healthcheck-д шууд ашиглагдана
- Cookie нь HTTPS proxy дээр `Secure` flag-тай ажиллана

## Railway дээр тавих

Хэрвээ танай repository-ийн service root нь энэ `glass-ledger` хавтас мөн бол Railway дээр бараг шууд deploy хийнэ.

Алхам:

1. GitHub repo руу code-оо push хийнэ.
2. `Railway` дээр `Deploy from GitHub repo` сонгоно.
3. Хэрвээ monorepo бол `Root Directory`-г `glass-ledger` гэж өгнө.
4. Service settings дээр энэ төсөлд байгаа `railway.json` файлыг ашиглуулна.
   Хэрвээ Railway өөрөө автоматаар аваагүй бол config path-ийг `/glass-ledger/railway.json` гэж заана.
5. Service дээр `Volume` нэмээд mount path-ийг яг `/data` болгоно.
6. Variables дээр дараах утгуудыг тохируулна:
   - `HOST=0.0.0.0`
   - `GLASS_LEDGER_DATA_DIR=/data`
   - `GLASS_LEDGER_ADMIN_CODE=өөрийн-хүчтэй-admin-код`
   - `GLASS_LEDGER_MANAGER_CODE=анхны-менежер-код`
   - `GLASS_LEDGER_MANAGER_NAME=анхны-менежер-нэр`
7. Deploy дууссаны дараа `Settings -> Networking -> Generate Domain` хийнэ.
8. Хэрвээ өөрийн domain ашиглах бол `+ Custom Domain` дээрээс DNS зааврыг нь дагана.

Railway дээр app start command нь:

```bash
npm start
```

Root directory нь:

```text
glass-ledger
```

Volume mount path нь:

```text
/data
```

## Deployment-д хэрэгтэй env

- `PORT` : platform өөрөө өгнө
- `HOST=0.0.0.0`
- `GLASS_LEDGER_DATA_DIR=/data`
- `RAILWAY_VOLUME_MOUNT_PATH` : Railway volume холбоход runtime дээр автоматаар орж ирнэ
- `GLASS_LEDGER_ADMIN_CODE=өөрийн-нууц-код`
- `GLASS_LEDGER_MANAGER_CODE=анхны-менежер-код`
- `GLASS_LEDGER_MANAGER_NAME=анхны-менежер-нэр`

## Нэвтрэх код

Анхны default код:

- ADMIN: `Sun60077779`
- Анхны худалдааны менежер: `viewer123`

Хэрвээ өөр код хэрэгтэй бол `glass-ledger/data/credentials.runtime.json` файл сервер анх асахад автоматаар үүснэ. Тэр файлын кодыг солиод серверээ дахин асаана.

Online орчинд default код үлдээхгүй, дээрх environment variable-аар өөрчилж ашиглах нь зөв.

## Өгөгдөл хадгалах

- Борлуулалтын мөрүүд `glass-ledger/data/store.runtime.json` файлд хадгалагдана.
- Нэвтрэх код `glass-ledger/data/credentials.runtime.json` файлд хадгалагдана.

Эдгээр runtime файлууд `.gitignore` дотор орсон тул локал өгөгдөл тань repo дээрх кодтой холилдохгүй.

Хэрвээ `GLASS_LEDGER_DATA_DIR` өгвөл өгөгдөл тэр хавтас руу хадгалагдана. Энэ нь Railway volume эсвэл VPS disk-д байрлуулахад хэрэгтэй.

Railway дээр `GLASS_LEDGER_DATA_DIR` өгөхгүй байсан ч volume-оо холбоод mount path нь `/data` байвал app өөрөө `RAILWAY_VOLUME_MOUNT_PATH`-аас таньж ажиллана. Гэхдээ ойлгомжтой байлгахын тулд `GLASS_LEDGER_DATA_DIR=/data` гэж давхар тохируулахыг зөвлөе.
