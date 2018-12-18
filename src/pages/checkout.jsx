import React from 'react';
import styled from 'styled-components';
import CreditCardInput from 'react-credit-card-input';

import PageLayout from '../components/PageLayout';
import { PageHeaderStyledComponent } from '../components/PageHeader';
import { withHorizontalPadding } from './../components/PageLayout';
import { device } from '../utilities/device';
import { TextInput } from '../components/Input';
import PaymentMethods from '../components/Checkout/PaymentMethods';

import cardLogo from '../components/Checkout/assets/logo-card.png';
import speiLogo from '../components/Checkout/assets/logo-spei.png';
import oxxoLogo from '../components/Checkout/assets/logo-oxxo.png';
import Button from './../components/Button/index';
import AppLayout from '../components/AppLayout';
import customerValidationSchema from '../components/Checkout/customerValidation';

const GraySection = styled.section`
  background: ${({ theme }) => theme.color.darkGray};
  flex: 1;
`;

const GraySectionWithPadding = withHorizontalPadding(GraySection.extend`
  padding-top: 1em;
  padding-bottom: 1em;
`);

const FormContentSection = styled.section`
  width: 60%;

  ${device.laptop} {
    width: 80%;
  }

  ${device.tablet} {
    width: 100%;
  }
`;

const PageHeaderWithPadding = withHorizontalPadding(styled(
  PageHeaderStyledComponent
)`
  padding-bottom: 3rem;

  ${device.tablet} {
    padding-bottom: 2em;
  }
`);

const Spacer = styled.div`
  background: ${({ theme }) => theme.color.black};
  height: 1px;
  flex: 1;
`;

const Paragraph = styled.p`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 1em;
  line-height: 1.3em;
  color: ${({ theme }) => theme.color.black};
  text-align: justify;
`;

const SubsectionHeader = styled.h2`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-weight: 700;
  font-size: 1.5em;
  color: ${({ theme }) => theme.color.black};
  line-height: 1.5em;
`;

const UserDataForm = styled.form`
  margin: 1em 0;
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.main};
  display: flex;
  flex-direction: ${({ vertical }) => vertical && 'column'};

  ${device.tablet} {
    flex-direction: column;
  }
`;

const InputLabel = styled(Label)`
  align-items: center;
  width: 90%;
  margin: 1.5em 0;
  justify-content: space-between;

  ${device.laptop} {
    width: 100%;
  }

  ${device.tablet} {
    align-items: flex-start;
  }
`;

const CardPaymentLabel = styled(Label)`
  > * {
    margin-bottom: 0.5rem;
  }
`;

const PaymentInputLabel = styled(InputLabel)`
  justify-content: start;

  ${device.tablet} {
    align-items: center;
    flex-direction: column-reverse;
  }

  ${device.mobile} {
    justify-content: center;
  }
`;

const LabelText = styled.div`
  font-size: 1.2em;
  color: ${({ theme }) => theme.color.black};

  ${device.tablet} {
    margin: 0.5em 0;
  }
`;

const Input = TextInput.extend`
  width: ${({ full }) => (full ? '100%' : '65%')};
  border-radius: 0.2em;
  background: ${({ white, theme }) => (white ? 'white' : theme.color.darkGray)};
  border-color: ${({ white }) => white && 'transparent'};
  padding: 0.5em;
  line-height: 1.5em;
  box-sizing: border-box;

  ::placeholder {
    color: white;
  }

  ${device.tablet} {
    width: 100%;
  }
`;

const PaymentMethodLogo = styled.img`
  --c-height: 3.5em;
  height: var(--c-height);
  width: calc(var(--c-height) * 1.7);
  margin-left: 1em;

  ${device.tablet} {
    margin: 0;
    margin-bottom: 1em;
  }

  ${device.mobile} {
    --c-height: 2.5em;
  }
`;

const PaymentOptions = styled.div`
  display: flex;
`;

const HorizontalFlex = styled.div`
  display: flex;

  ${device.tablet} {
    flex-direction: column;
    margin-bottom: 0.5em;
  }
`;

const VerticalFlex = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const VerticalFieldset = styled(VerticalFlex)`
  justify-content: space-between;
`;

const PaymentButton = styled(Button)`
  margin: 2em 0;
`;

const ErrorSection = styled('div')`
  background-color: ${({ theme }) => theme.background.main};
  padding: 1em;
`;

const DeliveryInputLabel = styled.label`
  display: flex;
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.main};
  color: ${({ theme }) => theme.color.black};
  align-items: center;

  ${device.tablet} {
    margin-top: 1em;
  }
`;

const DeliveryInputText = styled.div`
  margin-left: 0.5em;
`;

class Checkout extends React.Component {
  state = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddressLine1: '',
    customerAddressLine2: '',
    customerCity: '',
    customerState: '',
    customerCountry: '',

    delivery: '',

    paymentMethod: 'CARD',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
    cleanCardNumber: '',
    cleanCardExpiry: '',
    inputFocus: '',

    errors: [],

    submitting: false,
  };

  handleChange = ({ target }) => {
    const { name, value } = target;

    this.setState({
      [name]: value,
    });
  };

  handleCardNumberChange = ({ target }) => {
    const { value } = target;
    this.setState({
      cardNumber: value,
      cleanCardNumber: value.replace(/\s/g, ''),
    });
  };

  handleCardExpiryChange = ({ target }) => {
    const { value } = target;
    this.setState({
      cardExpiry: value,
      cleanCardExpiry: value.replace(/[\s/]/g, ''),
    });
  };

  handleCardCVCChange = ({ target }) => {
    const { value } = target;
    this.setState({
      cardCvc: value,
    });
  };

  focusCvc = () => {
    this.setState({
      inputFocus: 'cvc',
    });
  };

  blurCvc = () => {
    this.setState({
      inputFocus: '',
    });
  };

  handleSubmit = async () => {
    if (!this.state.submitting) {
      this.setState(
        () => ({
          submitting: true,
          errors: [],
        }),
        async () => {
          try {
            // Validar datos de entrada de cliente
            await customerValidationSchema.validate(this.state, {
              abortEarly: false,
            });

            const response = await fetch('http://localhost:3000/orders/test', {
              method: 'POST',
            });
            const jsonResponse = await response.json();

            window.location.replace(jsonResponse.redirectionUrl);
          } catch (error) {
            // Los datos del cliente no son válidos. Mostrar errores al usuario.
            this.setState(() => ({
              errors: error.errors,
            }));
          }
        }
      );
    }
  };

  render() {
    return (
      <AppLayout>
        <PageLayout fluid>
          <PageHeaderWithPadding underline>Checkout</PageHeaderWithPadding>
          <GraySectionWithPadding>
            <FormContentSection>
              <SubsectionHeader>Dirección de envío</SubsectionHeader>
              <Paragraph>Llena aquí tu información de envío</Paragraph>
              <UserDataForm>
                <InputLabel>
                  <LabelText>Nombre</LabelText>
                  <Input
                    value={this.state.customerName}
                    onChange={this.handleChange}
                    name="customerName"
                  />
                </InputLabel>
                <InputLabel>
                  <LabelText>Correo</LabelText>
                  <Input
                    value={this.state.customerEmail}
                    onChange={this.handleChange}
                    name="customerEmail"
                  />
                </InputLabel>
                <InputLabel>
                  <LabelText>Teléfono</LabelText>
                  <Input
                    value={this.state.customerPhone}
                    onChange={this.handleChange}
                    name="customerPhone"
                  />
                </InputLabel>
                <InputLabel>
                  <LabelText>Calle y número</LabelText>
                  <Input
                    value={this.state.customerAddressLine1}
                    onChange={this.handleChange}
                    name="customerAddressLine1"
                  />
                </InputLabel>
                <InputLabel>
                  <LabelText>Colonia y CP</LabelText>
                  <Input
                    value={this.state.customerAddressLine2}
                    onChange={this.handleChange}
                    name="customerAddressLine2"
                  />
                </InputLabel>
                <InputLabel>
                  <LabelText>Ciudad</LabelText>
                  <Input
                    value={this.state.customerCity}
                    onChange={this.handleChange}
                    name="customerCity"
                  />
                </InputLabel>
                <InputLabel>
                  <LabelText>Estado o provincia</LabelText>
                  <Input
                    value={this.state.customerState}
                    onChange={this.handleChange}
                    name="customerState"
                  />
                </InputLabel>
                <InputLabel>
                  <LabelText>País</LabelText>
                  <Input
                    value={this.state.customerCountry}
                    onChange={this.handleChange}
                    name="customerCountry"
                  />
                </InputLabel>
              </UserDataForm>
            </FormContentSection>
          </GraySectionWithPadding>
          <Spacer />
          <GraySectionWithPadding>
            <HorizontalFlex>
              <VerticalFlex>
                <SubsectionHeader>Método de envío</SubsectionHeader>
                <Paragraph>Selecciona tu método de envío.</Paragraph>
              </VerticalFlex>
              <VerticalFieldset>
                <DeliveryInputLabel>
                  <input
                    type="radio"
                    name="delivery"
                    value="2-5 dias"
                    checked={this.state.delivery === '2-5 dias'}
                    onChange={this.handleChange}
                  />
                  <DeliveryInputText>
                    2 a 5 días hábiles (gratis)
                  </DeliveryInputText>
                </DeliveryInputLabel>
                <DeliveryInputLabel>
                  <input
                    type="radio"
                    name="delivery"
                    value="dia siguiente"
                    checked={this.state.delivery === 'dia siguiente'}
                    onChange={this.handleChange}
                  />
                  <DeliveryInputText>Día siguiente ($50.00)</DeliveryInputText>
                </DeliveryInputLabel>
              </VerticalFieldset>
            </HorizontalFlex>
            {/*
          </GraySectionWithPadding>
          <Spacer />
          
          <GraySectionWithPadding>
            <FormContentSection>
              <SubsectionHeader>Opciones de pago</SubsectionHeader>
              <Paragraph>Selecciona tu método de pago preferido.</Paragraph>
              <PaymentOptions>
                <PaymentInputLabel>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={this.state.paymentMethod === 'CARD'}
                    onChange={this.handleChange}
                  />
                  <PaymentMethodLogo src={cardLogo} alt="Pago por tarjeta" />
                </PaymentInputLabel>
                <PaymentInputLabel>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="SPEI"
                    checked={this.state.paymentMethod === 'SPEI'}
                    onChange={this.handleChange}
                  />
                  <PaymentMethodLogo src={speiLogo} alt="Pago por spei" />
                </PaymentInputLabel>
                <PaymentInputLabel>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="OXXO"
                    checked={this.state.paymentMethod === 'OXXO'}
                    onChange={this.handleChange}
                  />
                  <PaymentMethodLogo src={oxxoLogo} alt="Pago por Oxxo" />
                </PaymentInputLabel>
              </PaymentOptions>
            </FormContentSection>
            <PaymentMethods
              {...this.state}
              visibleOption={this.state.paymentMethod}
              handleChange={this.handleChange}
              cardChildren={
                <React.Fragment>
                  <CardPaymentLabel vertical>
                    <LabelText>Datos de tarjeta</LabelText>
                    <CreditCardInput
                      cardNumberInputProps={{
                        value: this.state.cardNumber,
                        onChange: this.handleCardNumberChange,
                      }}
                      cardExpiryInputProps={{
                        value: this.state.cardExpiry,
                        onChange: this.handleCardExpiryChange,
                      }}
                      cardCVCInputRenderer={({ props }) => (
                        <input
                          {...props}
                          onChange={this.handleCardCVCChange}
                          value={this.state.cardCvc}
                          onFocus={this.focusCvc}
                          onBlur={this.blurCvc}
                        />
                      )}
                      fieldClassName="input"
                    />
                  </CardPaymentLabel>
                  <CardPaymentLabel vertical>
                    <LabelText>Nombre en tarjeta</LabelText>
                    <Input
                      onChange={this.handleChange}
                      name="cardName"
                      value={this.state.cardName}
                      full
                      white
                    />
                  </CardPaymentLabel>
                </React.Fragment>
              }
            />
            */}

            <PaymentButton onClick={this.handleSubmit} small>
              Proceder a pago
            </PaymentButton>
            {this.state.errors.length > 0 && (
              <ErrorSection>
                {this.state.errors.map(error => (
                  <Paragraph>{error}</Paragraph>
                ))}
              </ErrorSection>
            )}
          </GraySectionWithPadding>
        </PageLayout>
      </AppLayout>
    );
  }
}

export default Checkout;
