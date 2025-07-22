import printJS from 'print-js';
import { useParams } from 'react-router';
import { useGetLot, useGetLotItems } from '../lots.query';
import BaseButton from '@/components/ui/baseButton';
import LoadingSection from '@/components/ui/loadings/LoadingSection';

export default function LotsQr() {
  const { id } = useParams();
  const { data, isLoading } = useGetLot(id);
  const { data: dataItems, isLoading: isLoadingItems } = useGetLotItems(id);

  const handlePrint = () => {
    printJS({
      printable: 'printJS-form',
      type: 'html',
      scanStyles: false,
    });
  };

  if (isLoading || isLoadingItems) return <LoadingSection />;

  return (
    <>
      <BaseButton onClick={handlePrint} label="Imprimir" className="mb-5" />
      <div id="printJS-form">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {dataItems?.map((item) => (
            <div style={{ width: '20.00%', paddingTop: '10px' }} key={item.id}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={item.qr}
                  alt=""
                  width="70%"
                  style={{ margin: 'auto' }}
                />
              </div>
              <div
                style={{
                  width: '100%',
                  margin: '0',
                  padding: '0',
                  paddingTop: '5px',
                  paddingBottom: '10px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {data?.product.name} <br />{' '}
                {`(Lote: ${data?.number}, Articulo: ${item.number})`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
