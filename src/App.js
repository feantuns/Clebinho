import React, { Component } from 'react';
import './App.css';

class Clebinho extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campo: '',
      idCampo: 0,
      campos: [],
      qtdRows: 0,
      cresc: true,
      dadosNaoAgrupados: '',
      dadosAgrupados: '',
    };
    this.handleClebar = this.handleClebar.bind(this);
    this.handleOnChangeCampo = this.handleOnChangeCampo.bind(this);
    this.handleOnChangeValue = this.handleOnChangeValue.bind(this);
    this.handleClebinho = this.handleClebinho.bind(this);
    this.handleCalculos = this.handleCalculos.bind(this);
  }
  handleClebar(e) {
    e.preventDefault();
    this.setState(prevState => ({
      campos: [
        ...prevState.campos,
        {
          campo: prevState.campo,
          idCampo: prevState.idCampo,
          idValues: 0,
          values: [],
          value: '',
        },
      ],
      idCampo: prevState.idCampo + 1,
      campo: '',
    }));
  }
  handleOnChangeCampo(e) {
    this.setState({
      campo: e.target.value,
    });
  }
  handleOnChangeValue(e, idCampoP) {
    this.setState({
      campos: this.state.campos.map(
        ({ campo, idCampo, idValues, values, value }) =>
          idCampoP === idCampo
            ? {
                campo,
                idCampo,
                idValues,
                values,
                value: e.target.value,
              }
            : {
                campo,
                idCampo,
                idValues,
                values,
                value,
              },
      ),
    });
  }
  handleClebinho(e, idCampoP) {
    e.preventDefault();
    this.setState(
      prevState => {
        return {
          campos: prevState.campos.map(
            ({ campo, idCampo, idValues, values, value }) =>
              idCampoP === idCampo
                ? {
                    campo,
                    idCampo,
                    idValues: prevState.campos[idCampo].idValues + 1,
                    values: [
                      ...prevState.campos[idCampo].values,
                      { value, id: idValues },
                    ],
                    value: '',
                  }
                : {
                    campo,
                    idCampo,
                    idValues,
                    values,
                    value,
                  },
          ),
        };
      },
      () => {
        this.sortValues(idCampoP, true);
        this.setState({
          qtdRows: this.bringRows(idCampoP),
        });
      },
    );
  }
  bringRows(idCampoP) {
    let qtd = this.state.qtdRows;
    let prev = this.state.campos[idCampoP].idValues;
    if (prev >= qtd) qtd = prev;
    return qtd;
  }
  sortValues(idCampoP, cresc) {
    const arrayOrdenado = this.state.campos[idCampoP].values.sort((a, b) =>
      cresc ? a.value - b.value : b.value - a.value,
    );
    this.setState(prevState => {
      return {
        campos: prevState.campos.map(
          ({ campo, idCampo, idValues, values, value }) =>
            idCampoP === idCampo
              ? {
                  campo,
                  idCampo,
                  idValues,
                  values: arrayOrdenado,
                  value,
                }
              : {
                  campo,
                  idCampo,
                  idValues,
                  values,
                  value,
                },
        ),
        cresc,
      };
    });
  }
  createTable() {
    let table = [];

    for (let i = 0; i < this.state.qtdRows; i++) {
      let children = [];

      for (let j = 0; j < this.state.campos.length; j++)
        children.push(
          <td key={j}>
            {this.state.campos[j]
              ? this.state.campos[j].values[i]
                ? this.state.campos[j].values[i].value
                : ''
              : ''}
          </td>,
        );

      table.push(<tr key={i}>{children}</tr>);
    }

    return table;
  }
  handleCalculos(idCampoP) {
    const { campo, values } = this.state.campos[idCampoP];
    const qtdItens = values.length;

    const reducer = (accumulator, currentValue) =>
      Number(accumulator) + Number(currentValue);
    let notFilteredValues = [];
    let filteredValues = [];
    filteredValues.push(values[0].value);
    values.forEach(({ value }) => {
      if (!filteredValues.includes(value)) filteredValues.push(value);
      notFilteredValues.push(value);
    });

    const somatoria = notFilteredValues.reduce(reducer);
    const media = (somatoria / qtdItens).toFixed(2);
    let dp = 0;
    notFilteredValues.forEach(value => {
      return (dp += Math.pow(value - media, 2));
    });
    dp = Math.sqrt(dp / qtdItens).toFixed(2);
    const nroClasses = Math.sqrt(qtdItens);
    console.log(nroClasses);
    const table = (
      <table>
        <tbody>
          <tr>
            <th>{campo}</th>
            <th>Freq. Absoluta</th>
            <th>Freq. Relativa</th>
          </tr>
          {filteredValues.map((value, index) => {
            let freqAbsoluta = 0;
            values.forEach(val => {
              if (val.value === value) freqAbsoluta++;
            });
            let freqRelativa = freqAbsoluta / qtdItens;
            return (
              <tr key={index}>
                <td>{value}</td>
                <td>{freqAbsoluta}</td>
                <td>{freqRelativa.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Média</td>
            <td>{media}</td>
          </tr>
          <tr>
            <td>Desvio Padrão</td>
            <td>{dp}</td>
          </tr>
        </tfoot>
      </table>
    );
    this.setState({
      dadosNaoAgrupados: table,
    });
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleClebar}>
          <input
            placeholder="Nome do campo"
            onChange={this.handleOnChangeCampo}
            type="text"
            value={this.state.campo}
            required
          />
          <button type="submit">Clebar</button>
        </form>
        {this.state.campos &&
          this.state.campos.map(({ campo, idCampo }) => {
            return (
              <form
                key={idCampo}
                onSubmit={e => this.handleClebinho(e, idCampo)}
              >
                <label htmlFor={idCampo}>{campo}</label>
                <br />
                <input
                  placeholder={campo}
                  onChange={e => this.handleOnChangeValue(e, idCampo)}
                  type="number"
                  step="0.01"
                  value={this.state.campos[idCampo].value}
                  id={idCampo}
                  required
                  autoFocus
                />
                <button type="submit">Clebinho</button>
              </form>
            );
          })}
        <table>
          <tbody>
            <tr>
              {this.state.campos &&
                this.state.campos.map(({ campo, idCampo, values }) => {
                  return (
                    <th
                      onDoubleClick={() =>
                        this.sortValues(idCampo, !this.state.cresc)
                      }
                      onClick={() =>
                        values.length > 0
                          ? this.handleCalculos(idCampo)
                          : alert(`Adicione algum dado ao campo ${campo} antes`)
                      }
                      key={idCampo}
                    >
                      {campo}
                    </th>
                  );
                })}
            </tr>
            {this.state.qtdRows > 0 && this.createTable()}
          </tbody>
        </table>

        {this.state.dadosNaoAgrupados}
        {this.state.dadosAgrupados}
      </div>
    );
  }
}

export default Clebinho;
