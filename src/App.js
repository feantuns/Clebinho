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
    let groupedValues = [];
    let i = 0;
    let auxVet = [];
    const nroClasses = Math.floor(Math.sqrt(20));
    console.log(nroClasses);
    let base = Number(notFilteredValues[0]) + Number(nroClasses);
    let bases = [base];
    notFilteredValues.forEach((val, index) => {
      if (val <= base) {
        auxVet.push(val);
      } else {
        groupedValues[i] = auxVet;
        i++;
        auxVet = [];
        auxVet.push(val);
        base = Number(val) + Number(nroClasses);
        bases.push(base);
      }
      if (index === notFilteredValues.length - 1) {
        groupedValues[i] = auxVet;
      }
    });
    console.log({ groupedValues, bases, notFilteredValues });

    let aux = 0;
    let aux2 = 0;

    const table = (
      <table>
        <tbody>
          <tr>
            <th>{campo}</th>
            <th>Freq. Absoluta</th>
            <th>Freq. Absoluta Acumulada</th>
            <th>Freq. Relativa</th>
            <th>Freq. Relativa Acumulada</th>
          </tr>
          {filteredValues.map((value, index) => {
            let freqAbsoluta = 0;
            values.forEach(val => {
              if (val.value === value) freqAbsoluta++;
            });
            let freqAbsAcu = freqAbsoluta + aux;
            aux = freqAbsAcu;
            let freqRelativa = freqAbsoluta / qtdItens;
            let freqRelativaAcu = freqAbsoluta / qtdItens + aux2;
            aux2 = freqRelativaAcu;
            return (
              <tr key={index}>
                <td>{value}</td>
                <td>{freqAbsoluta}</td>
                <td>{freqAbsAcu}</td>
                <td>{freqRelativa.toFixed(2)}</td>
                <td>{freqRelativaAcu.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <th>Média</th>
            <th>Desvio Padrão</th>
          </tr>
          <tr>
            <td>{notFilteredValues.length}</td>
            <td>{media}</td>
            <td>{dp}</td>
          </tr>
        </tfoot>
      </table>
    );

    aux = 0;
    aux2 = 0;

    const agrupados = (
      <table>
        <tbody>
          <tr>
            <th>{campo}</th>
            <th>Freq. Absoluta</th>
            <th>Freq. Absoluta Acumulada</th>
            <th>Freq. Relativa</th>
            <th>Freq. Relativa Acumulada</th>
          </tr>
          {groupedValues.map((value, index) => {
            console.log(value);
            let range = `${value[0]} - ${value[value.length - 1]}`;
            let freqAbsAcu = value.length + aux;
            aux = freqAbsAcu;
            let freqRelativa = value.length / qtdItens;
            let freqRelativaAcu = value.length / qtdItens + aux2;
            aux2 = freqRelativaAcu;
            return (
              <tr key={index}>
                <td>{range}</td>
                <td>{value.length}</td>
                <td>{freqAbsAcu}</td>
                <td>{freqRelativa.toFixed(2)}</td>
                <td>{freqRelativaAcu.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <th>Média</th>
            <th>Desvio Padrão</th>
          </tr>
          <tr>
            <td>{notFilteredValues.length}</td>
            <td>{media}</td>
            <td>{dp}</td>
          </tr>
        </tfoot>
      </table>
    );
    this.setState({
      dadosNaoAgrupados: table,
      dadosAgrupados: agrupados,
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
