import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSizes, FontWeights } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n';

// Auth screens
import {
  SplashScreen, LanguageSelectionScreen, OnboardingScreen, LoginScreen,
  SignUpScreen, ForgotPasswordScreen, PermissionsScreen, OnboardingTutorialScreen,
} from '../screens/auth';

// Home
import HomeScreen from '../screens/home/HomeScreen';

// Telemedicine
import {
  ConsultSpecialtyScreen, DoctorsListScreen, DoctorProfileScreen,
  ConsultModeScreen, AppointmentBookingScreen, WaitingRoomScreen,
  ActiveVideoConsultScreen, ActiveAudioConsultScreen, ActiveTextConsultScreen,
  PostConsultSummaryScreen, DigitalPrescriptionViewScreen, FollowUpSchedulingScreen,
  ConsultationHistoryScreen, ConsultationDetailScreen, ReferralNoticeScreen,
} from '../screens/telemedicine';

// Health Records
import {
  HealthProfileScreen, EditProfileScreen, MedicalHistoryScreen,
  ImmunizationScreen, TestReportsScreen, UploadReportScreen,
  TrendAnalysisScreen, MedicationsScreen, AdherenceLogScreen,
  QRShareScreen, DataAccessScreen, AuditLogScreen, ExportDataScreen, SyncStatusScreen,
} from '../screens/health';

// Emergency
import {
  EmergencyHomeScreen, IncidentSelectScreen, SymptomQuestionnaireScreen,
  SeverityResultScreen, FirstAidInstructionsScreen, NextStepsScreen,
  NearestHospitalsScreen, EmergencyContactsScreen, FollowupReminderScreen,
} from '../screens/emergency';

// Symptom Checker
import {
  SymptomCheckerHomeScreen, BodyDiagramScreen, SymptomInputScreen,
  ClarifyingQuestionsScreen, SymptomResultsScreen, RecommendedActionScreen,
  DoctorQuestionsScreen, SymptomHistoryScreen,
} from '../screens/symptomChecker';

// Medicine
import {
  MedicineSearchScreen, PharmacyResultsScreen, PharmacyFilterScreen,
  PharmacyDetailScreen, PharmacyMapViewScreen, MedicineDetailScreen,
  GenericAlternativesScreen, PriceComparisonScreen, PrescriptionUploadScreen,
  MarkPurchasedScreen,
} from '../screens/medicine';

// Notifications
import {
  NotificationsListScreen, NotificationDetailScreen, NotificationSettingsScreen,
} from '../screens/notifications';

// Settings
import {
  SettingsHomeScreen, ProfileSettingsScreen, LanguageSettingsScreen,
  NotificationPrefsScreen, PrivacySettingsScreen, HelpSupportScreen,
  AboutAppScreen, FeedbackScreen,
} from '../screens/settings';

// AI
import { AIHomeScreen, AIChatScreen } from '../screens/ai';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─── Bottom Tab Navigator ───
function MainTabs() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 64 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: FontSizes.xs,
          fontWeight: FontWeights.medium,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            HomeTab:      focused ? 'home'         : 'home-outline',
            HealthTab:    focused ? 'heart'        : 'heart-outline',
            EmergencyTab: focused ? 'alert-circle' : 'alert-circle-outline',
            MedicineTab:  focused ? 'medkit'       : 'medkit-outline',
            AITab:        focused ? 'sparkles'     : 'sparkles-outline',
          };
          return <Ionicons name={icons[route.name]} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ tabBarLabel: t('tabs.home') }} />
      <Tab.Screen name="HealthTab" component={HealthStackScreen} options={{ tabBarLabel: t('tabs.health') }} />
      <Tab.Screen name="EmergencyTab" component={EmergencyStackScreen}
        options={{
          tabBarLabel: t('tabs.emergency'),
          tabBarIconStyle: {},
          tabBarActiveTintColor: Colors.error,
        }}
      />
      <Tab.Screen name="MedicineTab" component={MedicineStackScreen} options={{ tabBarLabel: t('tabs.medicine') }} />
      <Tab.Screen name="AITab" component={AIStackScreen} options={{ tabBarLabel: t('tabs.aiSuite') }} />
    </Tab.Navigator>
  );
}

// ─── AI Stack ───
function AIStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AIHome" component={AIHomeScreen} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />
    </Stack.Navigator>
  );
}

// ─── Home Stack ───
function HomeStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsListScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      {/* Settings – accessible via gear icon in HomeScreen header */}
      <Stack.Screen name="Settings" component={SettingsHomeScreen} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
      <Stack.Screen name="NotificationPrefs" component={NotificationPrefsScreen} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="AboutApp" component={AboutAppScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      {/* Telemedicine flow */}
      <Stack.Screen name="ConsultSpecialty" component={ConsultSpecialtyScreen} />
      <Stack.Screen name="DoctorsList" component={DoctorsListScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="ConsultMode" component={ConsultModeScreen} />
      <Stack.Screen name="AppointmentBooking" component={AppointmentBookingScreen} />
      <Stack.Screen name="WaitingRoom" component={WaitingRoomScreen} />
      <Stack.Screen name="ActiveVideoConsult" component={ActiveVideoConsultScreen} />
      <Stack.Screen name="ActiveAudioConsult" component={ActiveAudioConsultScreen} />
      <Stack.Screen name="ActiveTextConsult" component={ActiveTextConsultScreen} />
      <Stack.Screen name="PostConsultSummary" component={PostConsultSummaryScreen} />
      <Stack.Screen name="DigitalPrescriptionView" component={DigitalPrescriptionViewScreen} />
      <Stack.Screen name="FollowUpScheduling" component={FollowUpSchedulingScreen} />
      <Stack.Screen name="ConsultationHistory" component={ConsultationHistoryScreen} />
      <Stack.Screen name="ConsultationDetail" component={ConsultationDetailScreen} />
      <Stack.Screen name="ReferralNotice" component={ReferralNoticeScreen} />
      {/* Symptom Checker flow */}
      <Stack.Screen name="SymptomCheckerHome" component={SymptomCheckerHomeScreen} />
      <Stack.Screen name="BodyDiagram" component={BodyDiagramScreen} />
      <Stack.Screen name="SymptomInput" component={SymptomInputScreen} />
      <Stack.Screen name="ClarifyingQuestions" component={ClarifyingQuestionsScreen} />
      <Stack.Screen name="SymptomResults" component={SymptomResultsScreen} />
      <Stack.Screen name="RecommendedAction" component={RecommendedActionScreen} />
      <Stack.Screen name="DoctorQuestions" component={DoctorQuestionsScreen} />
      <Stack.Screen name="SymptomHistory" component={SymptomHistoryScreen} />
    </Stack.Navigator>
  );
}

// ─── Health Stack ───
function HealthStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HealthProfile" component={HealthProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MedicalHistory" component={MedicalHistoryScreen} />
      <Stack.Screen name="Immunization" component={ImmunizationScreen} />
      <Stack.Screen name="TestReports" component={TestReportsScreen} />
      <Stack.Screen name="UploadReport" component={UploadReportScreen} />
      <Stack.Screen name="TrendAnalysis" component={TrendAnalysisScreen} />
      <Stack.Screen name="Medications" component={MedicationsScreen} />
      <Stack.Screen name="AdherenceLog" component={AdherenceLogScreen} />
      <Stack.Screen name="QRShare" component={QRShareScreen} />
      <Stack.Screen name="DataAccess" component={DataAccessScreen} />
      <Stack.Screen name="AuditLog" component={AuditLogScreen} />
      <Stack.Screen name="ExportData" component={ExportDataScreen} />
      <Stack.Screen name="SyncStatus" component={SyncStatusScreen} />
    </Stack.Navigator>
  );
}

// ─── Emergency Stack ───
function EmergencyStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmergencyHome" component={EmergencyHomeScreen} />
      <Stack.Screen name="IncidentSelect" component={IncidentSelectScreen} />
      <Stack.Screen name="SymptomQuestionnaire" component={SymptomQuestionnaireScreen} />
      <Stack.Screen name="SeverityResult" component={SeverityResultScreen} />
      <Stack.Screen name="FirstAidInstructions" component={FirstAidInstructionsScreen} />
      <Stack.Screen name="NextSteps" component={NextStepsScreen} />
      <Stack.Screen name="NearestHospitals" component={NearestHospitalsScreen} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
      <Stack.Screen name="FollowupReminder" component={FollowupReminderScreen} />
    </Stack.Navigator>
  );
}

// ─── Medicine Stack ───
function MedicineStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MedicineSearch" component={MedicineSearchScreen} />
      <Stack.Screen name="PharmacyResults" component={PharmacyResultsScreen} />
      <Stack.Screen name="PharmacyFilter" component={PharmacyFilterScreen} />
      <Stack.Screen name="PharmacyDetail" component={PharmacyDetailScreen} />
      <Stack.Screen name="PharmacyMapView" component={PharmacyMapViewScreen} />
      <Stack.Screen name="MedicineDetail" component={MedicineDetailScreen} />
      <Stack.Screen name="GenericAlternatives" component={GenericAlternativesScreen} />
      <Stack.Screen name="PriceComparison" component={PriceComparisonScreen} />
      <Stack.Screen name="PrescriptionUpload" component={PrescriptionUploadScreen} />
      <Stack.Screen name="MarkPurchased" component={MarkPurchasedScreen} />
    </Stack.Navigator>
  );
}

// ─── Root Navigator ───
export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bgPrimary }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          // Auth Flow
          <Stack.Group>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Permissions" component={PermissionsScreen} />
            <Stack.Screen name="OnboardingTutorial" component={OnboardingTutorialScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
