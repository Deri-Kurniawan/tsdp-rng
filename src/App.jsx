import { useEffect, useRef, useState } from "react";
import { getInitialData, getInitialGradingRules, keyBindings } from "./data";
import { valueIsOnRange } from "./utils";

function App() {
  const [gradingRules] = useState(() => getInitialGradingRules());
  const [data, setData] = useState(() => getInitialData());
  const [finalGrade, setFinalGrade] = useState(0);
  const [finalGradeTypes, setFinalGradeTypes] = useState({
    predicate: "E",
    description: "Gagal",
    color: "#ff3300",
  });

  const closeModalInfoTriggerRef = useRef(null);

  const getFinalGradeTypes = (value) => {
    const grade = Math.round(value);
    let newGradeTypes = { ...finalGradeTypes };

    gradingRules.map(
      ({ predicate, lowerLimit, upperLimit, description, color }) => {
        if (valueIsOnRange(grade, lowerLimit, upperLimit)) {
          newGradeTypes = { predicate, description, color };
        }
      }
    );

    return newGradeTypes;
  };

  const execFinalCalculation = () => {
    let grade = 0;
    setFinalGrade(0);

    data.map(({ value, maxValue, valueWeight }) => {
      grade += (value / maxValue) * valueWeight;
    });

    setFinalGrade((prev) => prev + grade);
    setFinalGradeTypes(getFinalGradeTypes(grade));
  };

  const randomizeData = () => {
    let newData = [...data];

    newData.map((item) => {
      if (item.valueWeight != 0) {
        item.value = Math.round(Math.random() * item.maxValue);
      } else {
        item.value = 0;
      }
    });
    setData(newData);
    execFinalCalculation();
  };

  const onChangeHandle = ({ target }, key) => {
    let newData = [...data];
    let value = Number(target.value);
    let max = Number(target.max);
    const index = newData.findIndex(({ id }) => id === target.name);

    if (value > max) {
      target.value = Number(target.max);
    } else if (value < 0) {
      target.value = 0;
    }

    newData[index][key] = Number(target.value);
    setData(newData);
    execFinalCalculation();
  };

  useEffect(() => {
    const keydownHandler = (e) => {
      if (e.key === "i") {
        closeModalInfoTriggerRef.current.click();
      }
      if (e.key === "r") {
        randomizeData();
      }
    };

    window.addEventListener("keydown", keydownHandler);
    execFinalCalculation();

    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  return (
    <>
      <div className="lg:max-w-[1400px] lg:w-full lg:m-auto">
        <div className="grid grid-flow-row md:grid-flow-col py-5">
          <div className="grid grid-flow-col md:grid-flow-row md:col-span-2 lg:grid-flow-col lg:col-span-1 gap-3 px-5">
            <section id="bobot">
              <h1 className="text-2xl font-bold my-5 text-center drop-shadow-lg shadow-black">
                BOBOT
              </h1>
              {data.map(({ id, label, valueWeight, maxValueWeight }) => (
                <div className="form-control" key={id}>
                  <label className="label" htmlFor={`bobot-${id}`}>
                    <span className="label-text font-bold">{label}</span>
                    <span className="label-text">
                      {valueWeight}/
                      <span className="font-semibold">{maxValueWeight}</span>
                    </span>
                  </label>
                  <input
                    className="input input-bordered"
                    type="number"
                    name={id}
                    id={`bobot-${id}`}
                    defaultValue={valueWeight}
                    min={0}
                    max={maxValueWeight}
                    placeholder="0"
                    onChange={(e) => onChangeHandle(e, "valueWeight")}
                    onFocus={({ target }) => target.select()}
                  />
                </div>
              ))}
            </section>

            <section id="nilaiRata2">
              <h1 className="text-2xl font-bold my-5 text-center drop-shadow-lg shadow-black">
                NILAI RATA<sup>2</sup>
              </h1>
              {data.map(({ id, label, value, maxValue, valueWeight }) => (
                <div className="form-control" key={id}>
                  <label className="label" htmlFor={`avg-${id}`}>
                    <span className="label-text font-bold">{label}</span>
                    <span className="label-text">
                      {value}/<span className="font-semibold">{maxValue}</span>
                    </span>
                  </label>
                  <input
                    className="input input-bordered"
                    type="number"
                    name={id}
                    id={`avg-${id}`}
                    value={value}
                    min={0}
                    max={maxValue}
                    title={
                      valueWeight === 0
                        ? "Tidak dapat mengubah nilai karena bobot adalah 0"
                        : ""
                    }
                    placeholder="0"
                    onChange={(e) => onChangeHandle(e, "value")}
                    onFocus={({ target }) => target.select()}
                    disabled={valueWeight === 0}
                  />
                </div>
              ))}
            </section>
          </div>

          <div className="grid grid-flow-row lg:grid-flow-col lg:col-span-1 gap-3 px-5">
            <section id="penilaian">
              <h1 className="text-2xl font-bold my-5 text-center drop-shadow-lg shadow-black">
                PENILAIAN
              </h1>
              <table className="table w-full text-center shadow-sm">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Predikat</th>
                    <th>Interval Nilai</th>
                    <th>Keterangan</th>
                  </tr>
                </thead>

                <tbody>
                  {gradingRules.map(
                    (
                      { predicate, lowerLimit, upperLimit, description },
                      index
                    ) => (
                      <tr key={predicate}>
                        <td>{++index}</td>
                        <td>{predicate}</td>
                        <td>
                          {lowerLimit}-{upperLimit}
                        </td>
                        <td>{description}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </section>

            <section className="text-center" id="nilaiAkhir">
              <h1 className="text-2xl font-bold my-5 drop-shadow-lg shadow-black">
                NILAI AKHIR
              </h1>
              <h2
                className="text-[150px] transition-all duration-700 ease-in-out drop-shadow-lg shadow-black"
                style={{ color: finalGradeTypes.color }}
              >
                {finalGradeTypes.predicate}
              </h2>
              <h2 className="text-md text-2xl font-bold transition-all duration-700 ease-in-out drop-shadow-lg shadow-black">
                {finalGrade.toFixed(2)} -&gt; {Math.round(finalGrade)}
              </h2>
              <p className="my-5 font-semibold transition-all duration-700 ease-in-out drop-shadow-lg shadow-black">
                {finalGradeTypes.description}
              </p>
              <button
                className="btn btn-active btn-ghost mt-2 mr-2"
                onClick={randomizeData}
              >
                Acak Nilai
              </button>
              <label htmlFor="info-modal" className="btn modal-button">
                Info
              </label>
            </section>
          </div>
        </div>
      </div>

      {/* Info Modal Start */}
      <input type="checkbox" id="info-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-12/12 md:lg:w-8/12 lg:w-5/12 max-w-2xl relative">
          <label
            htmlFor="info-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            ref={closeModalInfoTriggerRef}
          >
            ✕
          </label>
          <h3 className="text-2xl font-extrabold">
            Bagaimana aplikasi ini bekerja?
          </h3>
          <h4 className="text-xl font-bold mt-3 mb-1">Informasi Perhitungan</h4>
          <p className="text-sm mb-1">
            Rumus yang digunakan dalam menghitung nilai akhir adalah sebagai
            berikut:
          </p>
          <div className="mockup-code text-sm my-2">
            <pre>
              <code>
                hasil = &#40;nilaiRataMahasiswa &#47; batasNilaiMaksimal&#41; *
                nilaiBobot
              </code>
            </pre>
          </div>
          <p className="text-sm my-2">
            Berikut adalah perhitungan dari nilai yang telah diinputkan:
          </p>
          <div className="py-2">
            <table className="text-sm text-left w-full">
              <thead>
                <tr className="text-center">
                  <th className="text-left">Jenis</th>
                  <th></th>
                  <th>Nilai Rata Mahasiswa</th>
                  <th></th>
                  <th>Maks Nilai</th>
                  <th></th>
                  <th>Bobot</th>
                  <th></th>
                  <th className="text-right">Hasil</th>
                </tr>
              </thead>
              <tbody>
                {data.map(({ label, value, maxValue, valueWeight }) => (
                  <tr key={label} className="text-center items-center">
                    <td className="text-left">{label}</td>
                    <td>&#61;</td>
                    <td>
                      <div className="flex justify-between items-center">
                        <span>&#40;</span>
                        <span>{value}</span>
                        <span></span>
                      </div>
                    </td>
                    <td>&#47;</td>
                    <td>
                      <div className="flex justify-between items-center">
                        <span></span>
                        <span>{maxValue}</span>
                        <span>&#41;</span>
                      </div>
                    </td>
                    <td>x</td>
                    <td>{valueWeight}</td>
                    <td>&#61;</td>
                    <td className="text-right">
                      {((value / maxValue) * valueWeight).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <th colSpan={7}>Nilai Akhir</th>
                  <td className="text-center">&#61;</td>
                  <td
                    sign="+"
                    className="border-t-[1px] border-black relative after:content-[attr(sign)] after:absolute after:-top-3 after:-right-3 text-right"
                  >
                    {finalGrade.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="text-xl font-bold mt-3 mb-1">Informasi Penilaian</h4>

          <p className="text-sm mb-1">
            Hasil Penjumlahan yang didapatkan yaitu{" "}
            <b>{finalGrade.toFixed(2)}</b> akan di bulatkan ke angka terdekat
            menjadi <b>{Math.round(finalGrade)}</b> dan akan di bandingkan
            dengan interval nilai yang ada pada tabel berikut:
          </p>

          <div className="py-2 overflow-x-scroll lg:overflow-x-hidden">
            <table className="table w-full text-center shadow-sm">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Predikat</th>
                  <th>Interval Nilai</th>
                  <th>Keterangan</th>
                  <th>Cocok</th>
                </tr>
              </thead>

              <tbody>
                {gradingRules.map(
                  (
                    { predicate, lowerLimit, upperLimit, description, color },
                    index
                  ) => (
                    <tr
                      key={predicate}
                      className={
                        valueIsOnRange(finalGrade, lowerLimit, upperLimit)
                          ? `font-bold`
                          : ""
                      }
                      style={{
                        color: valueIsOnRange(
                          finalGrade,
                          lowerLimit,
                          upperLimit
                        )
                          ? color
                          : "",
                      }}
                    >
                      <td>{++index}</td>
                      <td>{predicate}</td>
                      <td>
                        {lowerLimit}&#45;{upperLimit}
                      </td>
                      <td>{description}</td>
                      <td>
                        {valueIsOnRange(finalGrade, lowerLimit, upperLimit)
                          ? "Ya"
                          : "Tidak"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <p className="text-sm my-1">
            Setelah mencocokan nilai, maka diketahui bahwa nilai akhir yang
            didapatkan adalah <b>{Math.round(finalGrade)}</b> dengan predikat{" "}
            <b>{finalGradeTypes.predicate}</b> dan dengan keterangan nilai yaitu{" "}
            <b>{finalGradeTypes.description}</b>
          </p>
          <h4 className="hidden md:block text-xl font-bold mt-3 mb-1">
            Informasi Pintasan Keyboard
          </h4>
          <div className="hidden md:block py-2 overflow-x-scroll">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Key bindings</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {keyBindings.map(({ key, action }) => (
                  <tr>
                    <td className="text-center">{key}</td>
                    <td>{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Info Modal End */}
    </>
  );
}

export default App;
