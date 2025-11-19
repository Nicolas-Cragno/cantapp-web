import { PersonasProvider } from "./PersonasContext";
import { TractoresProvider } from "./TractoresContext";
import { FurgonesProvider } from "./FurgonesContext";
import { EventosProvider } from "./EventosContext";
import { StockProvider } from "./StockContext";
import { DataProvider } from "./DataContext"; // general

export function DataLayer({ children }) {
  return (
    <DataProvider>
      <PersonasProvider>
        <TractoresProvider>
          <FurgonesProvider>
            <EventosProvider>
                <StockProvider>
                     {children}
                </StockProvider>
            </EventosProvider>
          </FurgonesProvider>
        </TractoresProvider>
      </PersonasProvider>
    </DataProvider>
  );
}
