import { Component, createEffect, createRenderEffect, Show } from 'solid-js';
import { HopeProvider } from '@hope-ui/solid';
import { getJson } from './assets/utils';
import { calendarTable, setCalendarTable } from './store';

import Topbar from './components/Topbar/Topbar';
import Header from './components/Header/Header';
import Calendar from './components/Calendar/Calendar';

import "./styles.css";

const App: Component = () => {
  createRenderEffect(async () => {
    const response: any = await getJson();
    setCalendarTable(response.data || { '2024': {} });
  });

  return (
    <HopeProvider>
      <Show when={calendarTable()}>
        <div class="app-container">
          <Topbar />
          <Header />
          <Calendar />
        </div>
      </Show> 
      
    </HopeProvider>
  );
};

export default App;
