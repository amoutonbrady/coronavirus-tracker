import ow from "oceanwind";
import { Component, createResource, createState, For, Show } from "solid-js";
import { render } from "solid-js/dom";
import { http } from "@amoutonbrady/tiny-http";

const client = http({
  url: "https://covid2019-api.herokuapp.com/v2/",
  resolver: (res) => res.data,
});

const getGlobal = () => client.get("total");
const getCountries = () => client.get("current");
const formatNumber = Intl.NumberFormat(navigator.language);

const DataBox: Component<{ label: string; number: number }> = (props) => {
  return (
    <article
      class={ow({
        flex: true,
        "flex-col": true,
        "text-gray-800": true,
      })}
    >
      <h2
        class={ow({
          "font-semibold": true,
          uppercase: true,
        })}
      >
        {props.label}
      </h2>

      <data class={ow({ "text-xl": true })}>
        {formatNumber.format(props.number)}
      </data>
    </article>
  );
};

const App: Component = () => {
  const [global, loadGlobal] = createResource<{
    confirmed: number;
    deaths: number;
    recovered: number;
    active: number;
  }>(null);
  const [countries, loadCoutries] = createResource([]);
  const [state, setState] = createState({
    search: "",
    get filtered(): any[] {
      return countries().filter((country) =>
        country.location.toUpperCase().includes(state.search.toUpperCase())
      );
    },
  });

  loadCoutries(getCountries);
  loadGlobal(getGlobal);

  return (
    <div
      class={ow({
        flex: true,
        "flex-col": true,
        "max-w-4xl": true,
        "mx-auto": true,
        "p-8": true,
        "h-screen": true,
      })}
    >
      <div
        class={ow({
          flex: true,
          "space-x-6": true,
          "mx-auto": true,
        })}
      >
        <Show when={!global.loading} fallback={<p>Loading data...</p>}>
          <DataBox label="Deaths" number={global().deaths} />
          <DataBox label="Active" number={global().active} />
          <DataBox label="Confirmed" number={global().confirmed} />
          <DataBox label="Recovered" number={global().recovered} />
        </Show>
      </div>

      <input
        type="search"
        value={state.search}
        onInput={(e) => setState("search", e.target.value)}
      />
      <div
        class={ow({
          "flex-1": true,
          "overflow-auto": true,
          "px-4": true,
          "mt-4": true,
          relative: true,
        })}
      >
        <table class={ow({ "w-full": true })}>
          <thead class={ow({ "top-0": true })}>
            <tr class={ow({ "top-0": true })}>
              <th
                class={ow({
                  uppercase: true,
                  "text-sm": true,
                  "text-left": true,
                  "py-1": true,
                  "bg-white": true,
                  "top-0": true,
                })}
                style={{ position: "sticky" }}
              >
                country
              </th>
              <th
                class={ow({
                  uppercase: true,
                  "text-sm": true,
                  "text-right": true,
                  "py-1": true,
                  "bg-white": true,
                  "top-0": true,
                })}
                style={{ position: "sticky" }}
              >
                confirmed
              </th>
              <th
                class={ow({
                  uppercase: true,
                  "text-sm": true,
                  "text-right": true,
                  "py-1": true,
                  "bg-white": true,
                  "top-0": true,
                })}
                style={{ position: "sticky" }}
              >
                deaths
              </th>
              <th
                class={ow({
                  uppercase: true,
                  "text-sm": true,
                  "text-right": true,
                  "py-1": true,
                  "bg-white": true,
                  "top-0": true,
                })}
                style={{ position: "sticky" }}
              >
                recovered
              </th>
              <th
                class={ow({
                  uppercase: true,
                  "text-sm": true,
                  "text-right": true,
                  "py-1": true,
                  "bg-white": true,
                  "top-0": true,
                })}
                style={{ position: "sticky" }}
              >
                active
              </th>
            </tr>
          </thead>
          <tbody>
            <For each={state.filtered}>
              {(country) => (
                <tr>
                  <td>{country.location}</td>
                  <td class={ow({ "text-right": true })}>
                    {formatNumber.format(country.confirmed)}
                  </td>
                  <td class={ow({ "text-right": true })}>
                    {formatNumber.format(country.deaths)}
                  </td>
                  <td class={ow({ "text-right": true })}>
                    {formatNumber.format(country.recovered)}
                  </td>
                  <td class={ow({ "text-right": true })}>
                    {formatNumber.format(country.active)}
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};

render(() => App, document.getElementById("app"));
