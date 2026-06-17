import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { Resume } from "./types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, lineHeight: 1.4, color: "#333", fontFamily: "Helvetica" },
  header: { marginBottom: 16, borderBottom: "2px solid #1a1a2e", paddingBottom: 8 },
  name: { fontSize: 22, fontWeight: "bold", color: "#1a1a2e", marginBottom: 2 },
  contact: { fontSize: 9, color: "#666" },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", color: "#1a1a2e", borderBottom: "1px solid #1a1a2e", paddingBottom: 3, marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: 1 },
  expItem: { marginBottom: 8 },
  expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  jobTitle: { fontSize: 11, fontWeight: "bold" },
  company: { fontSize: 10, color: "#555" },
  dateRange: { fontSize: 9, color: "#777" },
  bullet: { fontSize: 9, marginLeft: 8, marginBottom: 1 },
  skill: { backgroundColor: "#f0f0f0", padding: "2px 6px", borderRadius: 2, fontSize: 9, marginRight: 4, marginBottom: 4 },
});

export async function generatePDF(resume: Resume): Promise<Blob> {
  const { personalInfo, experience, education, skills, summary } = resume;

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {personalInfo.fullName && (
          <View style={styles.header}>
            <Text style={styles.name}>{personalInfo.fullName}</Text>
            <Text style={styles.contact}>
              {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin].filter(Boolean).join(" | ")}
            </Text>
          </View>
        )}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={{ fontSize: 9 }}>{summary}</Text>
          </View>
        )}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.expItem}>
                <View style={styles.expHeader}>
                  <View><Text style={styles.jobTitle}>{exp.title}</Text><Text style={styles.company}>{exp.company}</Text></View>
                  <Text style={styles.dateRange}>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</Text>
                </View>
                {exp.bullets.filter(Boolean).map((b, i) => <Text key={i} style={styles.bullet}>• {b}</Text>)}
              </View>
            ))}
          </View>
        )}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                <Text style={{ fontSize: 10 }}><Text style={{ fontWeight: "bold" }}>{edu.degree}</Text>{edu.field && ` in ${edu.field}`} — {edu.school}</Text>
                <Text style={{ fontSize: 9, color: "#777" }}>{edu.startDate} – {edu.endDate}</Text>
              </View>
            ))}
          </View>
        )}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {skills.map((s, i) => <Text key={i} style={styles.skill}>{s}</Text>)}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );

  return await pdf(doc).toBlob();
}
