export interface MKROOutput {
  type: 'PLAN_PROPOSAL' | 'SAVE_DIRECTIVES' | 'PROFILE_UPDATE' | 'STATUS_SUMMARY';
  data: any;
}

export function parseCoachOutput(response: string): {
  humanText: string;
  machineOutput: MKROOutput | null;
} {
  // Extract machine-readable block
  const startMarker = '<!--MKRO_OUTPUT-->';
  const endMarker = '<!--/MKRO_OUTPUT-->';
  
  const startIdx = response.indexOf(startMarker);
  const endIdx = response.indexOf(endMarker);
  
  let humanText = response;
  let machineOutput: MKROOutput | null = null;
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    // Extract human text (everything before machine block)
    humanText = response.substring(0, startIdx).trim();
    
    // Extract and parse machine block
    const machineBlock = response.substring(
      startIdx + startMarker.length,
      endIdx
    ).trim();
    
    try {
      // Try to clean up the JSON if it has code fences or extra formatting
      let cleanedBlock = machineBlock.trim();
      
      // Remove code fences if present
      if (cleanedBlock.startsWith('```json')) {
        cleanedBlock = cleanedBlock.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedBlock.startsWith('```')) {
        cleanedBlock = cleanedBlock.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      const parsed = JSON.parse(cleanedBlock);
      machineOutput = {
        type: parsed.type,
        data: parsed
      };
    } catch (error) {
      console.error('Failed to parse machine output:', error);
      console.error('Machine block content:', machineBlock);
    }
  }
  
  return { humanText, machineOutput };
}