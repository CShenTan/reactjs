import axios from "axios";
import "primeicons/primeicons.css";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "./pokeDex.css";
import JsPDF from "jspdf";
import html2canvas from "html2canvas";

function PokeDex() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonModal, setpokemonModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState({
    name: "",
    url: "",
  });

  const [pokemonDetail, setPokemonDetail] = useState({
    sprites: [],
    stats: [],
  });

  const [loading, setLoading] = useState(false);

  const dt = useRef(null);
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(10);
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  const reportRef = useRef();

  // Open Modal for Add Record
  function openpokemonModal() {
    setpokemonModal(!pokemonModal);
  }

  // Load Data to Datatable
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      loadPokemon();
      setLoading(false);
    }, Math.random() * 1000 + 250);

    initFilters1();
  }, []);

  const loadPokemon = async () => {
    const result = await axios.get(`https://pokeapi.co/api/v2/pokemon`);
    setPokemons(result.data.results);
  };

  // Export Datatable to CSV
  const exportCSV = () => {
    dt.current.exportCSV();
  };

  // Get Datatable Page
  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  // Datatable Template
  const template2 = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: "All", value: options.totalRecords },
      ];

      return (
        <React.Fragment>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Show:
          </span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
          />
        </React.Fragment>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    },
  };

  // Filter Datatable Global
  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  // Initialize Filter Values
  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      code: {
        value: null,
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue1("");
  };

  // Datatable Header
  const header = (
    <div className="table-header">
      <span style={{ color: "white" }}>Pokedex List</span>
      <div className="table-header-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
          />
        </span>

        <Button
          label="Export to CSV"
          icon="pi pi-upload"
          className="p-button-help ms-2 p-button-sm p-button-rounded align-baseline custom_button"
          onClick={exportCSV}
        />
      </div>
    </div>
  );

  const generatePDF = () => {
    html2canvas(reportRef.current, {
      letterRendering: 1,
      allowTaint: true,
      useCORS: true,
    }).then((canvas) => {
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL();
      const pdf = new JsPDF("l", "mm", "a4");
      pdf.addImage(imgData, "jpeg", 0, 0, imgWidth, imgHeight);
      pdf.save("report.pdf");
    });
  };

  // Datatable Modal Header
  const headerModal = (
    <div className="table-header">
      <span style={{ color: "white" }}>Pokedex List</span>
      <div className="table-header-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
          />
        </span>

        <Button
          label="Export to CSV"
          icon="pi pi-upload"
          className="p-button-help ms-2 p-button-sm p-button-rounded align-baseline custom_button"
          onClick={exportCSV}
        />
        <Button
          label="Export to PDF"
          icon="pi pi-upload"
          className="p-button-help ms-2 p-button-sm p-button-rounded align-baseline custom_button"
          onClick={generatePDF}
        />
      </div>
    </div>
  );

  useEffect(() => {
    loadPokemonDetail();
  }, [selectedPokemon]);

  const loadPokemonDetail = async () => {
    if (selectedPokemon.url !== "") {
      const url = selectedPokemon.url;
      const result = await axios.get(url);

      setPokemonDetail(result.data);
    }
  };

  const [basicData, setBasicData] = useState({});

  useEffect(() => {
    const b = Object.entries(pokemonDetail.stats).map((item) => {
      return item[1].base_stat;
    });

    const c = Object.entries(pokemonDetail.stats).map((item) => {
      return item[1].stat.name;
    });

    setBasicData({
      labels: c,
      datasets: [
        {
          label: "Base Stat",
          backgroundColor: "#42A5F5",
          data: b,
        },
      ],
    });
  }, [pokemonDetail]);

  const getLightTheme = () => {
    let basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
      },
    };

    return {
      basicOptions,
    };
  };

  const { basicOptions } = getLightTheme();
  return (
    <div>
      <DataTable
        ref={dt}
        value={pokemons}
        paginator
        paginatorTemplate={template2}
        first={first2}
        rows={rows2}
        onPage={onCustomPage2}
        paginatorClassName="justify-content-end"
        className="mt-6"
        responsiveLayout="scroll"
        filters={filters1}
        filterDisplay="menu"
        header={header}
        resizableColumns
        columnResizeMode="fit"
        showGridlines
        size="small"
        loading={loading}
        selectionMode="single"
        selection={selectedPokemon}
        onSelectionChange={(e) => {
          setSelectedPokemon(e.value);
          openpokemonModal();
        }}
      >
        <Column field="name" header="Name"></Column>
        <Column field="url" header="URL"></Column>
      </DataTable>
      <Dialog
        header="Pokemon Detailed"
        visible={pokemonModal}
        style={{ width: "90vw" }}
        onHide={openpokemonModal}
      >
        <div ref={reportRef}>
          {pokemonDetail.sprites !== undefined && (
            <div>
              <div>Selected: {selectedPokemon.name}</div>
              <img
                src={pokemonDetail.sprites.front_default}
                style={{ padding: "10px" }}
              />
              <DataTable
                ref={dt}
                value={pokemonDetail.stats}
                paginator
                paginatorTemplate={template2}
                first={first2}
                rows={rows2}
                onPage={onCustomPage2}
                paginatorClassName="justify-content-end"
                className="mt-6"
                responsiveLayout="scroll"
                filters={filters1}
                filterDisplay="menu"
                header={headerModal}
                resizableColumns
                columnResizeMode="fit"
                showGridlines
                size="small"
                loading={loading}
              >
                <Column field="stat.name" header="Stat Name"></Column>
                <Column field="base_stat" header="Base Stat"></Column>
              </DataTable>
              <div className="card">
                <h5>Vertical</h5>
                <Chart type="bar" data={basicData} options={basicOptions} />
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}

export default PokeDex;
