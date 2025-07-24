import { BrowserRouter, Route, Routes } from 'react-router';
import { Login } from '@/domains/auth';
import { CustomerForm, CustomersList } from '@/domains/customers';
import { ItemsByLot } from '@/domains/items';
import {
  LotForm,
  LotsList,
  LotsQr,
  LotsReport,
  LotsReportByProduct,
} from '@/domains/lots';
import { ProductForm, ProductList } from '@/domains/products';
import { RegisterByItem } from '@/domains/registers';
import { useSettingStore } from '@/domains/settings';
import { TicketDetail, TicketForm, TicketList, TicketEvidenceForm } from '@/domains/tickets';
import TicketCloseForm from '@/domains/tickets/pages/TicketCloseForm';
import { UserForm, UsersList } from '@/domains/users';
import { WarehousesList } from '@/domains/warehouses';
import Authenticated from '@/layouts/authenticatedLayout';
import Base from '@/layouts/baseLayout';
import Guest from '@/layouts/guestLayout';
import Dashboard from '@/pages/Dashboard';

export default function RootRouter() {
  const darkMode = useSettingStore((state) => state.isDarkMode);

  const company = 'THT Servicio Técnico';
  const titleLogin = `Iniciar sesión en ${company}`;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Base />}>
          <Route element={<Guest />}>
            <Route path="/" element={<Login title={titleLogin} />} />
            <Route path="login" element={<Login title={titleLogin} />} />

            <Route
              path="/rastreo-lotes"
              element={<LotsReport isGuestBasic />}
            />
            <Route
              path="/register/by-item/:id"
              element={<RegisterByItem isGuestBasic />}
            />
          </Route>

          <Route
            element={<Authenticated company={company} isDarkMode={darkMode} />}
          >
            <Route path="/welcome" element={<Dashboard />} />

            <Route path="/users" element={<UsersList />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/:id" element={<UserForm />} />

            <Route path="/customers" element={<CustomersList />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/customers/:id" element={<CustomerForm />} />

            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id" element={<ProductForm />} />

            <Route path="/tickets" element={<TicketList />} />
            <Route path="/tickets/new" element={<TicketForm />} />
            <Route path="/tickets/:id/view" element={<TicketDetail />} />
            <Route path="/tickets/:id" element={<TicketForm />} />
            <Route path="/tickets/:id/close" element={<TicketCloseForm />} />
            <Route path="/tickets/:id/evidence" element={<TicketEvidenceForm />} />

            <Route path="/warehouses" element={<WarehousesList />} />

            <Route path="/lots" element={<LotsList />} />
            <Route path="/lots/new" element={<LotForm />} />
            <Route path="/lots/qr/:id" element={<LotsQr />} />
            <Route
              path="/lots/report-by-product"
              element={<LotsReportByProduct />}
            />
            <Route path="/lots/report" element={<LotsReport />} />

            <Route path="/items/by-lot/:id" element={<ItemsByLot />} />

            <Route path="/register/by-item/:id" element={<RegisterByItem />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
