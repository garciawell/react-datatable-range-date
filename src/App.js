import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import "react-dates/initialize";
import "react-table/react-table.css";
import "react-dates/lib/css/_datepicker.css";

import ReactTable from "react-table";
import { DateRangePicker, SingleDatePicker } from "react-dates";
import moment from "moment";

moment.locale("pt-br");

class App extends Component {
  state = {
    dobStartDate: null,
    dobEndDate: null
  };

  returnYears = () => {
    let years = [];
    for (let i = moment().year() - 100; i <= moment().year(); i++) {
      years.push(<option value={i}>{i}</option>);
    }
    return years;
  };

  renderMonthElement = ({ month, onMonthSelect, onYearSelect }) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <select
          value={month.month()}
          onChange={e => onMonthSelect(month, e.target.value)}
        >
          {moment.months().map((label, value) => (
            <option value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div>
        <select
          value={month.year()}
          onChange={e => onYearSelect(month, e.target.value)}
        >
          {this.returnYears()}
        </select>
      </div>
    </div>
  );

  gridData = [
    {
      dob: "2018-02-02",
      txt: "test1"
    },
    {
      dob: "2019-02-02",
      txt: "test2"
    },
    {
      dob: "2015-02-02",
      txt: "test3"
    }
  ];
  gridColumns = [
    {
      Header: "txt",
      accessor: "txt",
      Cell: row => <span>{row.value}</span>,
      Filter: ({ filter, onChange }) => (
        <input
          type="text"
          value={filter ? filter.value : ""}
          placeholder="Chercher..."
          style={{ width: "100%" }}
          onChange={event => onChange(event.target.value)}
        />
      )
    },
    {
      header: "Date",
      accessor: "dob",
      headerClassName: "contain-react-date",
      Cell: row => <div>{moment(row.value).format("DD/MM/YYYY")}</div>,
      Filter: ({ filter, onChange }) => (
        <DateRangePicker
          startDate={this.state.dobStartDate}
          endDate={this.state.dobEndDate}
          // onDatesChange={({ startDate, endDate }) => {this.setState({ dobStartDate: startDate, dobEndDate: endDate }); onFilterChange({startDate, endDate});}}

          onDatesChange={({ startDate, endDate }) => {
            this.setState(
              { dobStartDate: startDate, dobEndDate: endDate },
              () => {
                onChange({ startDate, endDate });
              }
            );
          }}
          renderMonthElement={this.renderMonthElement}
          focusedInput={this.state.focusedInput}
          onFocusChange={focusedInput => this.setState({ focusedInput })}
          isOutsideRange={() => false}
          withPortal={true}
          showClearDates={true}
        />
      ),
      filterMethod: (filter, row) => {
        if (filter.value.startDate === null || filter.value.endDate === null) {
          // Incomplet or cleared date picker
          console.log("Incomplet or cleared date picker");
          return true;
        }

        if (
          moment(row[filter.id]).isBetween(
            filter.value.startDate,
            filter.value.endDate
          )
        ) {
          // Found row matching filter
          console.log("Found row matching filter");
          return true;
        }
      }
    }
  ];

  render() {
    return (
      <div className="App">
        <ReactTable
          data={this.gridData}
          columns={this.gridColumns}
          defaultPageSize={10}
          className="-striped -highlight"
          previousText="Précedente"
          nextText="Suivante"
          loadingText="Chargement..."
          noDataText="Aucun contact n'a été trouvé"
          pageText="Page"
          ofText="sur"
          rowsText="lignes"
          showFilters="true"
          resizable="true"
          filterable
          defaultSorting={[
            {
              id: "dob",
              desc: false
            }
          ]}
        />
      </div>
    );
  }
}

export default App;
