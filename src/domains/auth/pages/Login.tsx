import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { useAuthStore } from '../auth.store';
import { LoginAuthT } from '../auth.type';
import Form, { Field, FormField, ValuesFormT } from '@/components/form';
import BaseButtons from '@/components/ui/BaseButtons';
import BaseDivider from '@/components/ui/BaseDivider';
import SectionFullScreen from '@/components/ui/SectionFullScreen';
import BaseButton from '@/components/ui/baseButton';
import CardBox from '@/components/ui/cardBox';
import { EMPTY_STRING } from '@/utils/constants';

type Props = {
  title: string;
};

export default function Login(props: Props) {
  const { title } = props;

  const login = useAuthStore((state) => state.login);
  const isAuth = useAuthStore((state) => state.isAuth);

  const navigate = useNavigate();

  const handleInitValues = () => {
    return {
      email: '',
      password: '',
    } as LoginAuthT;
  };

  const signupSchema = Yup.object().shape({
    email: Yup.string()
      .email('Correo inválido')
      .default(EMPTY_STRING)
      .required('Requerido'),
    password: Yup.string().default(EMPTY_STRING).required('Requerido'),
  });

  const handleSubmit = (values: ValuesFormT) => {
    const json = values as LoginAuthT;
    login(json);
  };

  useEffect(() => {
    if (isAuth) {
      navigate('/welcome', { replace: true });
    }
  }, [isAuth, navigate]);

  return (
    <SectionFullScreen bg="purplePink">
      <div className="flex items-center justify-center w-full flex-col gap-2">
        <div className="flex flex-col justify-center items-center w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 gap-2 p-4">
          {/* <img src={Logo()} alt="Logo" className="w-28 h-28 rounded-lg mb-4" /> */}
          <h1 className="text-white text-2xl font-semibold text-center">
            {title}
          </h1>
        </div>
        <CardBox className="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl">
          <Form
            onSubmit={handleSubmit}
            schema={signupSchema}
            data={handleInitValues()}
          >
            <FormField label="Email">
              <Field name="email" type="email" placeholder="Email" />
            </FormField>

            <FormField label="Contraseña">
              <Field name="password" type="password" placeholder="Contraseña" />
            </FormField>

            <BaseDivider />

            <BaseButtons>
              <BaseButton
                className="w-full"
                color="info"
                label="Inicia sesión"
                type="submit"
                small={false}
              />
            </BaseButtons>
          </Form>
        </CardBox>
      </div>
    </SectionFullScreen>
  );
}
