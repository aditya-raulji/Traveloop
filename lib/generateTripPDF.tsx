import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Create styles
const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#FAFAFA' },
  coverPage: { padding: 40, backgroundColor: '#FAFAFA', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 36, marginBottom: 20, color: '#2C4A3B' },
  subtitle: { fontSize: 18, color: '#8C7A6B', marginBottom: 40 },
  coverImage: { width: '100%', height: 300, objectFit: 'cover', borderRadius: 12, marginBottom: 40 },
  sectionTitle: { fontSize: 22, color: '#2C4A3B', borderBottom: '1px solid #D4AF37', paddingBottom: 5, marginBottom: 15, marginTop: 30 },
  statBox: { padding: 15, backgroundColor: '#FFFFFF', borderRadius: 8, border: '1px solid #EAEAEA', marginBottom: 15 },
  statLabel: { fontSize: 12, color: '#8C7A6B', textTransform: 'uppercase' },
  statValue: { fontSize: 24, color: '#D4AF37', marginTop: 5 },
  dayHeader: { fontSize: 16, color: '#2C4A3B', backgroundColor: '#F0F0F0', padding: 10, marginTop: 20, borderRadius: 5 },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottom: '1px solid #EAEAEA' },
  activityTime: { width: '15%', fontSize: 11, color: '#8C7A6B' },
  activityName: { width: '65%', fontSize: 12, color: '#333333' },
  activityCost: { width: '20%', fontSize: 12, color: '#2C4A3B', textAlign: 'right' },
  expenseTable: { width: '100%', marginTop: 20 },
  expenseRow: { flexDirection: 'row', borderBottom: '1px solid #EAEAEA', paddingVertical: 8 },
  expenseHeader: { fontSize: 12, color: '#8C7A6B', textTransform: 'uppercase' },
  totalRow: { flexDirection: 'row', borderTop: '2px solid #2C4A3B', paddingVertical: 12, marginTop: 10 },
  totalText: { fontSize: 16, color: '#2C4A3B' },
  totalValue: { fontSize: 16, color: '#D4AF37', marginLeft: 'auto' }
});

export const TripPDFDocument = ({ trip }: { trip: any }) => {
  const startDate = trip.startDate ? format(new Date(trip.startDate), 'MMMM d, yyyy') : 'TBD';
  const endDate = trip.endDate ? format(new Date(trip.endDate), 'MMMM d, yyyy') : 'TBD';
  const cities = (trip.stops || []).map((s: any) => s.cityName).join(' — ');

  // Calculate totals
  let totalCost = 0;
  (trip.stops || []).forEach((stop: any) => {
    (stop.activities || []).forEach((act: any) => {
      totalCost += Number(act.cost || 0);
    });
    (stop.expenses || []).forEach((exp: any) => {
      totalCost += Number(exp.amount || 0);
    });
  });

  return (
    <Document>
      {/* PAGE 1 - COVER */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.title}>{trip.title || trip.name}</Text>
        <Text style={styles.subtitle}>{startDate} to {endDate}</Text>
        {(trip.coverImage || trip.imageUrl) && <Image src={trip.coverImage || trip.imageUrl} style={styles.coverImage} />}
        <Text style={{ fontSize: 16, color: '#2C4A3B', marginTop: 20 }}>{cities}</Text>
      </Page>

      {/* PAGE 2 - OVERVIEW */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Trip Overview</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15 }}>
          <View style={[styles.statBox, { width: '45%' }]}>
            <Text style={styles.statLabel}>Total Duration</Text>
            <Text style={styles.statValue}>{trip.endDate && trip.startDate ? Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0} Days</Text>
          </View>
          <View style={[styles.statBox, { width: '45%' }]}>
            <Text style={styles.statLabel}>Total Destinations</Text>
            <Text style={styles.statValue}>{trip.stops.length}</Text>
          </View>
          <View style={[styles.statBox, { width: '45%' }]}>
            <Text style={styles.statLabel}>Estimated Budget</Text>
            <Text style={styles.statValue}>${totalCost.toLocaleString()}</Text>
          </View>
          <View style={[styles.statBox, { width: '45%' }]}>
            <Text style={styles.statLabel}>Total Activities</Text>
            <Text style={styles.statValue}>{trip.stops.reduce((acc: number, stop: any) => acc + stop.activities.length, 0)}</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 3+ - ITINERARY */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Detailed Itinerary</Text>
        {(trip.stops || []).sort((a: any, b: any) => a.order - b.order).map((stop: any, index: number) => (
          <View key={index} style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: 18, color: '#D4AF37', marginBottom: 5 }}>Stop {index + 1}: {stop.cityName}</Text>
            <Text style={{ fontSize: 12, color: '#8C7A6B', marginBottom: 15 }}>
              {stop.startDate ? format(new Date(stop.startDate), 'MMM d') : 'TBD'} - {stop.endDate ? format(new Date(stop.endDate), 'MMM d, yyyy') : 'TBD'}
            </Text>
            
            {(stop.activities || []).length > 0 ? stop.activities.map((act: any, actIdx: number) => (
              <View key={actIdx} style={styles.activityRow}>
                <Text style={styles.activityTime}>{act.time || act.date ? format(new Date(act.date), 'HH:mm') : 'Any time'}</Text>
                <Text style={styles.activityName}>{act.activity?.name || 'Activity'}</Text>
                <Text style={styles.activityCost}>${act.cost || 0}</Text>
              </View>
            )) : (
              <Text style={{ fontSize: 12, color: '#8C7A6B', fontStyle: 'italic' }}>No activities planned yet.</Text>
            )}
          </View>
        ))}
      </Page>

      {/* LAST PAGE - EXPENSES */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Expense Summary</Text>
        <View style={styles.expenseTable}>
          <View style={styles.expenseRow}>
            <Text style={[styles.expenseHeader, { width: '30%' }]}>Category</Text>
            <Text style={[styles.expenseHeader, { width: '50%' }]}>Description</Text>
            <Text style={[styles.expenseHeader, { width: '20%', textAlign: 'right' }]}>Amount</Text>
          </View>
          
          {(trip.stops || []).map((stop: any) => 
            (stop.expenses || []).map((exp: any, i: number) => (
              <View key={`${stop.id}-${i}`} style={styles.expenseRow}>
                <Text style={{ width: '30%', fontSize: 11 }}>{exp.category}</Text>
                <Text style={{ width: '50%', fontSize: 11 }}>{exp.description}</Text>
                <Text style={{ width: '20%', fontSize: 11, textAlign: 'right' }}>${exp.amount}</Text>
              </View>
            ))
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total Expenses</Text>
            <Text style={styles.totalValue}>${totalCost.toLocaleString()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
