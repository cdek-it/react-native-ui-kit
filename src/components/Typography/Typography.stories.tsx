import type { Meta, StoryObj } from '@storybook/react'
import { IconArrowUpRight, IconInfoCircle } from '@tabler/icons-react-native'
import type { ReactNode } from 'react'
import { ScrollView, View } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { Anchor, Body, Caption, Service, Subtitle, Title } from './index'

interface OverviewArgs {
  readonly sampleText: string
  readonly showDetails: boolean
  readonly onLinkPress: () => void
}

const titleLevels = [
  'd1',
  'd2',
  'd3',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
] as const
const bodySizes = ['xl', 'lg', 'base'] as const
const textColors = ['default', 'secondary', 'primary'] as const
const statuses = [
  { variant: 'success', text: 'Посылка доставлена' },
  { variant: 'info', text: 'Курьер уже в пути' },
  { variant: 'warning', text: 'Проверьте адрес доставки' },
  { variant: 'danger', text: 'Не удалось сохранить изменения' },
  { variant: 'help', text: 'Поможем разобраться' },
] as const

const Section = ({
  number,
  title,
  description,
  children,
}: {
  readonly number: string
  readonly title: string
  readonly description: string
  readonly children: ReactNode
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeading}>
      <Subtitle color='primary'>{number}</Subtitle>
      <Title level='h3'>{title}</Title>
      <Caption color='secondary'>{description}</Caption>
    </View>
    {children}
  </View>
)

const Specimen = ({
  label,
  showDetails,
  children,
}: {
  readonly label: string
  readonly showDetails: boolean
  readonly children: ReactNode
}) => (
  <View style={styles.specimen}>
    {showDetails ? <Caption color='secondary'>{label}</Caption> : null}
    {children}
  </View>
)

const TypographyOverview = ({
  sampleText,
  showDetails,
  onLinkPress,
}: OverviewArgs) => {
  const { theme } = useUnistyles()

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      testID='TypographyOverview'
    >
      <View style={styles.intro}>
        <Subtitle color='primary'>Основы дизайн-системы</Subtitle>
        <Title level='d2'>Типографика</Title>
        <Body paragraph color='secondary'>
          От первого заголовка до последней подписи. Одна шкала — разные роли.
        </Body>
        <View style={styles.families}>
          <View style={styles.family}>
            <Caption color='secondary'>Заголовки</Caption>
            <Title level='h3'>{theme.fonts.fontFamily.heading}</Title>
            <Caption color='secondary'>Аа Бб Вв · Aa Bb Cc · 0123</Caption>
          </View>
          <View style={styles.family}>
            <Caption color='secondary'>Текст и интерфейс</Caption>
            <Body weight='bold'>{theme.fonts.fontFamily.base}</Body>
            <Caption color='secondary'>Аа Бб Вв · Aa Bb Cc · 0123</Caption>
          </View>
        </View>
      </View>

      <Section
        description='Title · от выразительного акцента до компактного заголовка'
        number='01'
        title='Заголовки'
      >
        {titleLevels.map((level) => (
          <Specimen
            key={level}
            label={level.toUpperCase()}
            showDetails={showDetails}
          >
            <Title level={level}>{sampleText}</Title>
          </Specimen>
        ))}
      </Section>

      <Section
        description='Subtitle · навигация, рубрики и названия разделов'
        number='02'
        title='Подзаголовки'
      >
        {[true, false].map((base) => (
          <Specimen
            key={String(base)}
            label={base ? 'Базовый' : 'Компактный'}
            showDetails={showDetails}
          >
            <Subtitle base={base}>{sampleText}</Subtitle>
          </Specimen>
        ))}
      </Section>

      <Section
        description='Body · три размера и два начертания'
        number='03'
        title='Основной текст'
      >
        {bodySizes.map((size) => (
          <View key={size} style={styles.specimen}>
            {showDetails ? (
              <Caption color='secondary'>{size.toUpperCase()}</Caption>
            ) : null}
            <Body size={size}>{sampleText}</Body>
            <Body size={size} weight='bold'>
              {sampleText}
            </Body>
          </View>
        ))}
        <View style={styles.readingSample}>
          <Subtitle color='primary'>Текст в контексте</Subtitle>
          <Title level='h2'>Ближе, чем кажется</Title>
          <Body paragraph>
            За каждой посылкой — чья-то история. Книга для друга, подарок к
            празднику или вещь, которую давно ждали. Мы помогаем важному
            оказаться рядом.
          </Body>
          <Anchor RightIcon={IconArrowUpRight} onPress={onLinkPress}>
            Узнать больше
          </Anchor>
        </View>
        <Specimen label='Цвет и акценты' showDetails={showDetails}>
          {textColors.map((color) => (
            <Body color={color} key={color}>
              {sampleText}
            </Body>
          ))}
          <Body strikethrough>Прежнее значение</Body>
          <Body disabled>Недоступное действие</Body>
        </Specimen>
      </Section>

      <Section
        description='Caption · пояснения и дополнительная информация'
        number='04'
        title='Подписи'
      >
        {textColors.map((color) => (
          <Specimen key={color} label={color} showDetails={showDetails}>
            <Caption color={color}>{sampleText}</Caption>
          </Specimen>
        ))}
        <Specimen label='С иконкой' showDetails={showDetails}>
          <Caption Icon={IconInfoCircle}>Срок хранения — 7 дней</Caption>
        </Specimen>
        <Specimen label='Недоступное состояние' showDetails={showDetails}>
          <Caption disabled>Информация появится позже</Caption>
        </Specimen>
      </Section>

      <Section
        description='Service · обратная связь и состояния'
        number='05'
        title='Служебный текст'
      >
        {statuses.map(({ variant, text }) => (
          <Specimen key={variant} label={variant} showDetails={showDetails}>
            <Service showIcon variant={variant}>
              {text}
            </Service>
            <Service base={false} showIcon={false} variant={variant}>
              {text}
            </Service>
          </Specimen>
        ))}
      </Section>

      <Section
        description='Anchor · самостоятельные и внутри текста'
        number='06'
        title='Ссылки'
      >
        <Specimen
          label='Обычная · с иконкой · посещённая'
          showDetails={showDetails}
        >
          <Anchor onPress={onLinkPress}>Отследить посылку</Anchor>
          <Anchor base RightIcon={IconArrowUpRight} onPress={onLinkPress}>
            Найти ближайший пункт
          </Anchor>
          <Anchor visited onPress={onLinkPress}>
            Условия доставки
          </Anchor>
        </Specimen>
        <Body paragraph>
          Продолжая, вы принимаете{' '}
          <Anchor noWrapper onPress={onLinkPress}>
            условия сервиса
          </Anchor>{' '}
          и соглашаетесь с правилами доставки.
        </Body>
      </Section>
    </ScrollView>
  )
}

const meta = {
  title: 'Typography/Overview',
  component: TypographyOverview,
  args: { sampleText: 'Доставка без границ', showDetails: true },
  argTypes: {
    sampleText: { control: 'text' },
    showDetails: { control: 'boolean' },
    onLinkPress: { action: 'onLinkPress' },
  },
  parameters: { controls: { exclude: ['onLinkPress'] } },
} satisfies Meta<typeof TypographyOverview>

export default meta

type Story = StoryObj<typeof TypographyOverview>

export const Overview: Story = {}

const styles = StyleSheet.create(({ semantic }) => ({
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    gap: semantic.dimension.space[800],
    paddingBottom: semantic.dimension.space[800],
  },
  intro: { gap: semantic.dimension.space[350] },
  families: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: semantic.dimension.space[200],
    marginTop: semantic.dimension.space[200],
  },
  family: {
    flexGrow: 1,
    flexBasis: 150,
    gap: semantic.dimension.space[200],
    padding: semantic.dimension.space[350],
    borderRadius: semantic.dimension.borderRadius[300],
    backgroundColor: semantic.colorScheme.color.bg.neutral.weak.default,
  },
  section: { gap: semantic.dimension.space[350] },
  sectionHeading: { gap: semantic.dimension.space[100] },
  specimen: {
    gap: semantic.dimension.space[200],
    paddingVertical: semantic.dimension.space[350],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: semantic.colorScheme.color.border.neutral.default,
  },
  readingSample: {
    gap: semantic.dimension.space[350],
    padding: semantic.dimension.space[600],
    marginVertical: semantic.dimension.space[200],
    borderRadius: semantic.dimension.borderRadius[400],
    backgroundColor: semantic.colorScheme.color.bg.neutral.weak.default,
  },
}))
